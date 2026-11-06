package com.liveasyhomes.visit;

import com.liveasyhomes.common.config.AppProperties;
import com.liveasyhomes.common.error.ApiException;
import com.liveasyhomes.property.Property;
import com.liveasyhomes.property.PropertyRepository;
import com.liveasyhomes.property.PropertyStatus;
import com.liveasyhomes.visit.dto.OtpSentResponse;
import com.liveasyhomes.visit.dto.SendOtpRequest;
import com.liveasyhomes.visit.dto.VerifyOtpRequest;
import com.liveasyhomes.visit.dto.VisitBookedResponse;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.HexFormat;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class VisitService {

  private static final SecureRandom RANDOM = new SecureRandom();
  private static final int MAX_OTP_ATTEMPTS = 5;
  private static final int MAX_SENDS_PER_PHONE = 3;
  private static final long SEND_WINDOW_MILLIS = 600_000L;

  private final ConcurrentHashMap<String, Deque<Long>> sendsByPhone = new ConcurrentHashMap<>();

  private final VisitOtpRepository challenges;
  private final VisitBookingRepository bookings;
  private final PropertyRepository properties;
  private final AppProperties appProperties;
  private final Environment environment;

  @Transactional
  public OtpSentResponse send(SendOtpRequest request) {
    String name = request.name() == null ? "" : request.name().trim();
    if (name.length() < 2) {
      throw new ApiException(400, "Please enter your full name.");
    }
    String email = request.email() == null ? "" : request.email().trim().toLowerCase();
    if (!email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
      throw new ApiException(400, "Please enter a valid email address.");
    }
    String phone = normalizePhone(request.phone());
    if (phone.length() != 10) {
      throw new ApiException(400, "Please enter a valid 10-digit mobile number.");
    }

    Property property = findProperty(request.propertyId())
        .filter(found -> found.getStatus() == PropertyStatus.PUBLISHED)
        .orElseThrow(() -> new ApiException(400, "Property information is missing."));

    boolean production = java.util.Arrays.stream(environment.getActiveProfiles())
        .anyMatch(profile -> profile.equalsIgnoreCase("prod") || profile.equalsIgnoreCase("production"));
    if (production && !appProperties.getOtp().isExposeInResponse()) {
      throw new ApiException(503, "Visit codes cannot be sent until SMS delivery is configured.");
    }

    limitSends(phone);
    String otp = String.valueOf(100000 + RANDOM.nextInt(900000));
    VisitOtpChallenge challenge = challenges.findByPhone(phone).orElseGet(VisitOtpChallenge::new);
    challenge.setPhone(phone);
    challenge.setCodeHash(hash(phone, otp));
    challenge.setExpiresAt(Instant.now().plusSeconds(appProperties.getOtp().getTtlSeconds()));
    challenge.setName(name);
    challenge.setEmail(email);
    challenge.setPropertySlug(property.getSlug());
    challenge.setPropertyTitle(
        request.propertyTitle() == null || request.propertyTitle().isBlank()
            ? property.getTitle()
            : request.propertyTitle().trim()
    );
    challenge.setFailedAttempts(0);
    challenges.save(challenge);

    String demoOtp = null;
    if (appProperties.getOtp().isExposeInResponse()) {
      demoOtp = otp;
      log.info("Visit OTP for {} is exposed because OTP_EXPOSE=true", phone);
    }

    return new OtpSentResponse(true, "OTP sent successfully.", appProperties.getOtp().getTtlSeconds(), demoOtp);
  }

  @Transactional
  public VisitBookedResponse verify(VerifyOtpRequest request) {
    String phone = normalizePhone(request.phone());
    if (phone.length() != 10) {
      throw new ApiException(400, "Invalid phone number.");
    }
    String code = request.otp() == null ? "" : request.otp().trim();
    if (!code.matches("^\\d{6}$")) {
      throw new ApiException(400, "Please enter the 6-digit OTP.");
    }

    VisitOtpChallenge challenge = challenges.findByPhone(phone)
        .orElseThrow(() -> new ApiException(400, "OTP expired or not found. Please request a new code."));
    if (challenge.getExpiresAt().isBefore(Instant.now())) {
      challenges.delete(challenge);
      throw new ApiException(400, "OTP has expired. Please request a new code.");
    }
    if (!MessageDigest.isEqual(
        challenge.getCodeHash().getBytes(StandardCharsets.UTF_8),
        hash(phone, code).getBytes(StandardCharsets.UTF_8)
    )) {
      int attempts = (challenge.getFailedAttempts() == null ? 0 : challenge.getFailedAttempts()) + 1;
      if (attempts >= MAX_OTP_ATTEMPTS) {
        challenges.delete(challenge);
        throw new ApiException(400, "Too many incorrect attempts. Please request a new code.");
      }
      challenge.setFailedAttempts(attempts);
      challenges.save(challenge);
      throw new ApiException(400, "Incorrect OTP. Please try again.");
    }

    VisitBooking booking = new VisitBooking();
    booking.setName(challenge.getName());
    booking.setEmail(challenge.getEmail());
    booking.setPhone(phone);
    booking.setPropertySlug(challenge.getPropertySlug());
    booking.setPropertyTitle(challenge.getPropertyTitle());
    bookings.save(booking);
    challenges.delete(challenge);

    return new VisitBookedResponse(
        true,
        "Visit scheduled successfully.",
        new VisitBookedResponse.Booking(
            booking.getName(),
            booking.getEmail(),
            booking.getPropertySlug(),
            booking.getPropertyTitle()
        )
    );
  }

  private Optional<Property> findProperty(String propertyId) {
    if (propertyId == null || propertyId.isBlank()) {
      return Optional.empty();
    }
    try {
      Optional<Property> byId = properties.findById(UUID.fromString(propertyId));
      if (byId.isPresent()) {
        return byId;
      }
    } catch (IllegalArgumentException ignored) {
      // Fall through to the public slug.
    }
    return properties.findBySlug(propertyId);
  }

  private void limitSends(String phone) {
    long now = System.currentTimeMillis();
    Deque<Long> window = sendsByPhone.computeIfAbsent(phone, ignored -> new ArrayDeque<>());
    synchronized (window) {
      while (!window.isEmpty() && now - window.peekFirst() > SEND_WINDOW_MILLIS) {
        window.removeFirst();
      }
      if (window.size() >= MAX_SENDS_PER_PHONE) {
        throw new ApiException(429, "Too many codes requested. Please wait and try again.");
      }
      window.addLast(now);
    }
  }

  private String hash(String phone, String otp) {
    try {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      byte[] bytes = digest.digest(
          (appProperties.getJwt().getSecret() + ":" + phone + ":" + otp).getBytes(StandardCharsets.UTF_8)
      );
      return HexFormat.of().formatHex(bytes);
    } catch (NoSuchAlgorithmException ex) {
      throw new IllegalStateException(ex);
    }
  }

  private static String normalizePhone(String phone) {
    String digits = phone == null ? "" : phone.replaceAll("\\D", "");
    return digits.length() <= 10 ? digits : digits.substring(digits.length() - 10);
  }
}
