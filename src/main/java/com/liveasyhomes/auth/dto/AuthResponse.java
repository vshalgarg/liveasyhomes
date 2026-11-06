package com.liveasyhomes.auth.dto;

import com.liveasyhomes.auth.Role;
import java.util.UUID;

public record AuthResponse(
    String token,
    String tokenType,
    long expiresIn,
    UserView user
) {

  public record UserView(UUID id, String name, String email, String phone, Role role) {
  }
}
