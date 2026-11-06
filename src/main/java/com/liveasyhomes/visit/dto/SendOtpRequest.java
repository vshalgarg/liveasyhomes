package com.liveasyhomes.visit.dto;

import jakarta.validation.constraints.NotBlank;

public record SendOtpRequest(
    @NotBlank String name,
    @NotBlank String email,
    @NotBlank String phone,
    String propertyId,
    String propertyTitle
) {
}
