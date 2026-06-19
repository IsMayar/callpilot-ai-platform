package com.callpilotai.aiconfig.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AiReceptionistConfigRequest(
        @NotBlank(message = "Greeting message is required.")
        @Size(max = 1000, message = "Greeting message must be 1000 characters or fewer.")
        String greetingMessage,

        @NotBlank(message = "After-hours message is required.")
        @Size(max = 1000, message = "After-hours message must be 1000 characters or fewer.")
        String afterHoursMessage,

        @NotBlank(message = "Emergency instructions are required.")
        @Size(max = 2000, message = "Emergency instructions must be 2000 characters or fewer.")
        String emergencyInstructions,

        @NotBlank(message = "Booking rules are required.")
        @Size(max = 4000, message = "Booking rules must be 4000 characters or fewer.")
        String bookingRules,

        @NotBlank(message = "Services offered are required.")
        @Size(max = 4000, message = "Services offered must be 4000 characters or fewer.")
        String servicesOffered,

        @Size(max = 32, message = "Fallback phone number must be 32 characters or fewer.")
        @Pattern(
                regexp = "^$|^\\+?[0-9 .()\\-]{7,32}$",
                message = "Fallback phone number must contain 7 to 32 valid phone characters.")
        String fallbackPhoneNumber) {
}
