package com.liveasyhomes.common.security;

import com.liveasyhomes.auth.Role;
import java.util.UUID;

public record UserPrincipal(UUID id, String email, Role role) {
}
