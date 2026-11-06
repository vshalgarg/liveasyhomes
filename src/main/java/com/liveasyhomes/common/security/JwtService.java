package com.liveasyhomes.common.security;

import com.liveasyhomes.auth.UserAccount;
import com.liveasyhomes.common.config.AppProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import javax.crypto.SecretKey;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class JwtService {

  public static final String DEV_SECRET = "dev-only-change-me-liveasyhomes-jwt-secret-32b";

  private final AppProperties properties;
  private final Environment environment;
  private SecretKey key;

  @PostConstruct
  void init() {
    String secret = properties.getJwt().getSecret();
    if (secret == null || secret.getBytes(StandardCharsets.UTF_8).length < 32) {
      throw new IllegalStateException("JWT_SECRET must be at least 32 bytes.");
    }
    if (DEV_SECRET.equals(secret)) {
      if (production()) {
        throw new IllegalStateException("Set a unique JWT_SECRET before running with the prod profile.");
      }
      log.warn("JWT_SECRET is still the development default. Set JWT_SECRET before deploying.");
    }
    if (production() && properties.getOtp().isExposeInResponse()) {
      throw new IllegalStateException("OTP_EXPOSE must be false when the prod profile is active.");
    }
    this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
  }

  public String generate(UserAccount user) {
    Instant now = Instant.now();
    Instant expires = now.plus(properties.getJwt().getExpirationMinutes(), ChronoUnit.MINUTES);
    return Jwts.builder()
        .subject(user.getId().toString())
        .claim("email", user.getEmail())
        .claim("role", user.getRole().name())
        .issuedAt(Date.from(now))
        .expiration(Date.from(expires))
        .signWith(key)
        .compact();
  }

  private boolean production() {
    return Arrays.stream(environment.getActiveProfiles())
        .anyMatch(profile -> profile.equalsIgnoreCase("prod") || profile.equalsIgnoreCase("production"));
  }

  public long expiresInSeconds() {
    return properties.getJwt().getExpirationMinutes() * 60;
  }

  public Claims parse(String token) {
    return Jwts.parser()
        .verifyWith(key)
        .build()
        .parseSignedClaims(token)
        .getPayload();
  }
}
