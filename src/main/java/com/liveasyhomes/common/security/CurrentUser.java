package com.liveasyhomes.common.security;

import com.liveasyhomes.common.error.ApiException;
import java.util.Optional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class CurrentUser {

  private CurrentUser() {
  }

  public static Optional<UserPrincipal> get() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
      return Optional.empty();
    }
    if (authentication.getPrincipal() instanceof UserPrincipal principal) {
      return Optional.of(principal);
    }
    return Optional.empty();
  }

  public static UserPrincipal require() {
    return get().orElseThrow(() -> new ApiException(401, "Authentication required."));
  }
}
