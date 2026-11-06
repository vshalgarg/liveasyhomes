package com.liveasyhomes.common.config;

import com.liveasyhomes.common.security.JwtService;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/** Stops a production process that is still using local development settings. */
@Component
@Profile("prod")
public class ProductionGuard implements ApplicationRunner {

  private final AppProperties properties;
  private final String databaseUsername;
  private final String databasePassword;
  private final String r2PublicBaseUrl;

  public ProductionGuard(
      AppProperties properties,
      @Value("${spring.datasource.username:}") String databaseUsername,
      @Value("${spring.datasource.password:}") String databasePassword,
      @Value("${app.storage.r2.public-base-url:}") String r2PublicBaseUrl
  ) {
    this.properties = properties;
    this.databaseUsername = databaseUsername;
    this.databasePassword = databasePassword;
    this.r2PublicBaseUrl = r2PublicBaseUrl;
  }

  @Override
  public void run(ApplicationArguments args) {
    List<String> problems = new ArrayList<>();
    String jwt = properties.getJwt().getSecret();
    if (jwt == null || jwt.getBytes(java.nio.charset.StandardCharsets.UTF_8).length < 32
        || JwtService.DEV_SECRET.equals(jwt)) {
      problems.add("Set JWT_SECRET to a unique value of at least 32 bytes.");
    }
    if (properties.getOtp().isExposeInResponse()) {
      problems.add("Set OTP_EXPOSE=false.");
    }
    if (!corsIsPublicHttps(properties.getCors().getAllowedOrigins())) {
      problems.add("Set CORS_ORIGINS to the public https site address.");
    }
    if (databaseUsername == null || databaseUsername.isBlank() || "liveasy".equals(databaseUsername)) {
      problems.add("Set DATABASE_USERNAME to a value other than liveasy.");
    }
    if (databasePassword == null || databasePassword.isBlank() || "liveasy".equals(databasePassword)) {
      problems.add("Set DATABASE_PASSWORD to a value other than liveasy.");
    }
    String adminPassword = properties.getAdmin().getPassword();
    if (properties.getAdmin().getEmail() == null || properties.getAdmin().getEmail().isBlank()) {
      problems.add("Set ADMIN_EMAIL.");
    }
    if (adminPassword == null || adminPassword.length() < 12 || "admin12345".equals(adminPassword)) {
      problems.add("Set ADMIN_PASSWORD to at least 12 characters and not admin12345.");
    }
    String storageType = properties.getStorage().getType();
    if (storageType != null && storageType.equalsIgnoreCase("r2")) {
      requireHttpsPublicImages(problems);
    }
    if (!problems.isEmpty()) {
      throw new IllegalStateException("Refusing to start in production: " + String.join(" ", problems));
    }
  }

  private void requireHttpsPublicImages(List<String> problems) {
    if (r2PublicBaseUrl == null || !r2PublicBaseUrl.startsWith("https://")) {
      problems.add("Set R2_PUBLIC_BASE_URL to an https address.");
    }
  }

  private static boolean corsIsPublicHttps(String origins) {
    if (origins == null || origins.isBlank()) {
      return false;
    }
    for (String origin : origins.split(",")) {
      String value = origin.trim();
      if (value.isEmpty() || "*".equals(value) || !value.startsWith("https://")) {
        return false;
      }
      String host = value.substring("https://".length()).toLowerCase();
      if (host.startsWith("localhost") || host.startsWith("127.0.0.1")) {
        return false;
      }
    }
    return true;
  }
}
