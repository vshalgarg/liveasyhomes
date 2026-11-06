package com.liveasyhomes.visit.dto;

import jakarta.validation.constraints.NotBlank;

public record VerifyOtpRequest(
    @NotBlank String phone,
    @NotBlank String otp
) {
}
