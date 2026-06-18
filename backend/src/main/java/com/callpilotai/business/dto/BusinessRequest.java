package com.callpilotai.business.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record BusinessRequest(
        @NotBlank(message = "Business name is required.")
        @Size(max = 160, message = "Business name must be 160 characters or fewer.")
        String name,

        @NotBlank(message = "Industry is required.")
        @Size(max = 100, message = "Industry must be 100 characters or fewer.")
        String industry,

        @NotBlank(message = "Phone number is required.")
        @Size(max = 32, message = "Phone number must be 32 characters or fewer.")
        @Pattern(
                regexp = "^\\+?[0-9 .()\\-]{7,32}$",
                message = "Phone number must contain 7 to 32 valid phone characters.")
        String phoneNumber,

        @NotBlank(message = "Timezone is required.")
        @Size(max = 64, message = "Timezone must be 64 characters or fewer.")
        String timezone) {
}

