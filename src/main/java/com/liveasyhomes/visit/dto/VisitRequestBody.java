package com.liveasyhomes.visit.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record VisitRequestBody(
    @NotBlank(message = "Please enter your full name.")
    @Size(min = 2, max = 80, message = "Please enter your full name.")
    String name,
    @NotBlank(message = "Please enter your email.")
    @Email(message = "Please enter a valid email address.")
    @Size(max = 160, message = "Please enter a valid email address.")
    String email,
    @NotBlank(message = "Please enter your mobile number.")
    @Size(max = 20, message = "Please enter a valid mobile number.")
    String phone,
    @NotBlank(message = "Property information is missing.")
    @Size(max = 160, message = "Property information is missing.")
    String propertyId
) {
}
