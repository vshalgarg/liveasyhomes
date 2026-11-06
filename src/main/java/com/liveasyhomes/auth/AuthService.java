package com.liveasyhomes.auth;

import com.liveasyhomes.auth.dto.AuthResponse;
import com.liveasyhomes.auth.dto.LoginRequest;
import com.liveasyhomes.auth.dto.RegisterRequest;
import com.liveasyhomes.common.error.ApiException;
import com.liveasyhomes.common.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final UserAccountRepository users;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  @Transactional
  public AuthResponse register(RegisterRequest request) {
    String email = normalizeEmail(request.email());
    if (users.existsByEmail(email)) {
      throw new ApiException(409, "An account with this email already exists.");
    }

    Role role = request.role() == null ? Role.TENANT : request.role();
    if (role != Role.TENANT) {
      throw new ApiException(400, "Public signup creates a tenant account. Listings are added by an admin.");
    }

    UserAccount user = new UserAccount();
    user.setName(request.name().trim());
    user.setEmail(email);
    user.setPhone(normalizePhone(request.phone()));
    user.setPasswordHash(passwordEncoder.encode(request.password()));
    user.setRole(role);
    return tokenFor(users.save(user));
  }

  @Transactional(readOnly = true)
  public AuthResponse login(LoginRequest request) {
    UserAccount user = users.findByEmail(normalizeEmail(request.email()))
        .filter(found -> passwordEncoder.matches(request.password(), found.getPasswordHash()))
        .orElseThrow(() -> new ApiException(401, "Invalid email or password."));
    return tokenFor(user);
  }

  private AuthResponse tokenFor(UserAccount user) {
    return new AuthResponse(
        jwtService.generate(user),
        "Bearer",
        jwtService.expiresInSeconds(),
        new AuthResponse.UserView(user.getId(), user.getName(), user.getEmail(), user.getPhone(), user.getRole())
    );
  }

  private static String normalizeEmail(String email) {
    return email.trim().toLowerCase();
  }

  private static String normalizePhone(String phone) {
    if (phone == null || phone.isBlank()) {
      return null;
    }
    String trimmed = phone.trim();
    if (!trimmed.matches("^[0-9+\\-\\s()]{7,20}$")) {
      throw new ApiException(400, "Please enter a valid phone number.");
    }
    return trimmed;
  }
}
