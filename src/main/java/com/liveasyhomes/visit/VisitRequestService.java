package com.liveasyhomes.visit;

import com.liveasyhomes.common.error.ApiException;
import com.liveasyhomes.common.security.FirebaseTokenVerifier;
import com.liveasyhomes.common.security.VerifiedCaller;
import com.liveasyhomes.property.Property;
import com.liveasyhomes.property.PropertyRepository;
import com.liveasyhomes.property.PropertyStatus;
import com.liveasyhomes.visit.dto.VisitRequestBody;
import com.liveasyhomes.visit.dto.VisitRequestResponse;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class VisitRequestService {

  private final FirebaseTokenVerifier tokens;
  private final PropertyRepository properties;
  private final VisitRequestStore store;
  private final VisitNotificationSender notifications;

  public VisitRequestResponse submit(String authorization, VisitRequestBody body) {
    VerifiedCaller caller = tokens.verifyAuthorization(authorization);
    String name = name(body.name());
    String email = email(body.email());
    String submittedPhone = PhoneNumbers.toE164(body.phone());
    if (!PhoneNumbers.isE164(submittedPhone)) {
      throw new ApiException(400, "Please enter a valid mobile number.");
    }
    Property property = availableProperty(body.propertyId());
    String verifiedPhone = PhoneNumbers.toE164(caller.phoneNumber());
    if (!submittedPhone.equals(verifiedPhone)) {
      throw new ApiException(403, "The phone number does not match the verified number.");
    }
    VisitRequest saved = store.create(caller, name, email, verifiedPhone, property);
    notify(saved);
    return new VisitRequestResponse(
        true,
        "Visit request submitted successfully",
        new VisitRequestResponse.Data(saved.getId().toString(), saved.getStatus().name())
    );
  }

  private void notify(VisitRequest saved) {
    try {
      notifications.send(saved);
    } catch (RuntimeException ex) {
      log.error("Visit request {} was saved but the notification email failed", saved.getId());
    }
  }

  private Property availableProperty(String propertyId) {
    Property property = find(propertyId).orElseThrow(() -> new ApiException(404, "Property not found."));
    if (property.getStatus() != PropertyStatus.PUBLISHED) {
      throw new ApiException(404, "Property not found.");
    }
    if (!property.isActive()) {
      throw new ApiException(403, "This property is not available for visits.");
    }
    return property;
  }

  private Optional<Property> find(String propertyId) {
    if (propertyId == null || propertyId.isBlank()) {
      return Optional.empty();
    }
    try {
      Optional<Property> byId = properties.findById(UUID.fromString(propertyId.trim()));
      if (byId.isPresent()) {
        return byId;
      }
    } catch (IllegalArgumentException ignored) {
      // The public id is the listing slug.
    }
    return properties.findBySlug(propertyId.trim());
  }

  private static String name(String raw) {
    String name = raw == null ? "" : raw.trim();
    if (name.length() < 2 || name.length() > 80) {
      throw new ApiException(400, "Please enter your full name.");
    }
    return name;
  }

  private static String email(String raw) {
    String email = raw == null ? "" : raw.trim().toLowerCase();
    if (!email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$") || email.length() > 160) {
      throw new ApiException(400, "Please enter a valid email address.");
    }
    return email;
  }
}
