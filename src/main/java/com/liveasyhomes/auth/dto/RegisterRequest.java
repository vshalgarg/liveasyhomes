package com.liveasyhomes.auth.dto;

import com.liveasyhomes.auth.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    @NotBlank(message = "Please enter your name.")
    @Size(min = 2, max = 80, message = "Please enter your name.")
    String name,
    @NotBlank(message = "Please enter your email.")
    @Email(message = "Please enter a valid email address.")
    @Size(max = 160)
    String email,
    @NotBlank(message = "Please enter a password.")
    @Size(min = 8, max = 72, message = "Password must be at least 8 characters.")
    String password,
    @Size(max = 20)
    String phone,
    Role role
) {
}
