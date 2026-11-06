package com.liveasyhomes.property.seed;

import com.liveasyhomes.auth.Role;
import com.liveasyhomes.auth.UserAccount;
import com.liveasyhomes.auth.UserAccountRepository;
import com.liveasyhomes.common.config.AppProperties;
import java.util.Arrays;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class PropertySeedRunner implements CommandLineRunner {

  private static final String DEV_ADMIN_PASSWORD = "admin12345";

  private final AppProperties properties;
  private final UserAccountRepository users;
  private final PasswordEncoder passwordEncoder;
  private final Environment environment;

  @Override
  @Transactional
  public void run(String... args) {
    seedAdmin();
  }

  private void seedAdmin() {
    String email = properties.getAdmin().getEmail();
    String password = properties.getAdmin().getPassword();
    if (email == null || email.isBlank() || password == null || password.isBlank()) {
      return;
    }
    String normalized = email.trim().toLowerCase();
    users.findByEmail(normalized).ifPresent(existing -> {
      if (passwordEncoder.matches(DEV_ADMIN_PASSWORD, existing.getPasswordHash())) {
        if (production()) {
          throw new IllegalStateException("Change ADMIN_PASSWORD before running with the prod profile.");
        }
        log.warn("Admin password is still the development password. Change it before going live.");
      }
      if (password.length() >= 12
          && !DEV_ADMIN_PASSWORD.equals(password)
          && !passwordEncoder.matches(password, existing.getPasswordHash())) {
        existing.setPasswordHash(passwordEncoder.encode(password));
        users.save(existing);
        log.info("Updated admin password for {}", normalized);
      }
    });
    if (users.existsByEmail(normalized)) {
      return;
    }
    if (production() && DEV_ADMIN_PASSWORD.equals(password)) {
      throw new IllegalStateException("Change ADMIN_PASSWORD before running with the prod profile.");
    }
    if (password.length() < 8) {
      log.warn("ADMIN_PASSWORD is shorter than 8 characters. Admin user was not created.");
      return;
    }
    UserAccount admin = new UserAccount();
    admin.setName("LivEasy Admin");
    admin.setEmail(normalized);
    admin.setPasswordHash(passwordEncoder.encode(password));
    admin.setRole(Role.ADMIN);
    users.save(admin);
    log.info("Created admin user {}", normalized);
  }

  private boolean production() {
    return Arrays.stream(environment.getActiveProfiles())
        .anyMatch(profile -> profile.equalsIgnoreCase("prod") || profile.equalsIgnoreCase("production"));
  }
}
