package com.callpilotai.customers.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CustomerRequest(
        @NotBlank(message = "Full name is required.")
        @Size(max = 160, message = "Full name must be 160 characters or fewer.")
        String fullName,

        @NotBlank(message = "Phone number is required.")
        @Size(max = 32, message = "Phone number must be 32 characters or fewer.")
        @Pattern(
                regexp = "^\\+?[0-9 .()\\-]{7,32}$",
                message = "Phone number must contain 7 to 32 valid phone characters.")
        String phoneNumber,

        @Email(message = "Email must be valid.")
        @Size(max = 160, message = "Email must be 160 characters or fewer.")
        String email,

        @Size(max = 320, message = "Address must be 320 characters or fewer.")
        String address,

        @Size(max = 2000, message = "Notes must be 2000 characters or fewer.")
        String notes) {
}

