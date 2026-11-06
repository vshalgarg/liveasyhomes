package com.liveasyhomes.auth;

import com.fasterxml.jackson.annotation.JsonCreator;
import java.util.Locale;

public enum Role {
  TENANT,
  LANDLORD,
  ADMIN;

  @JsonCreator
  public static Role from(String raw) {
    if (raw == null || raw.isBlank()) {
      return null;
    }
    return Role.valueOf(raw.trim().toUpperCase(Locale.ROOT));
  }
}
