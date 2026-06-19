package com.callpilotai.leads.dto;

import com.callpilotai.leads.LeadStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record LeadRequest(
        @NotBlank(message = "Customer name is required.")
        @Size(max = 160, message = "Customer name must be 160 characters or fewer.")
        String customerName,

        @NotBlank(message = "Phone number is required.")
        @Size(max = 32, message = "Phone number must be 32 characters or fewer.")
        @Pattern(
                regexp = "^\\+?[0-9 .()\\-]{7,32}$",
                message = "Phone number must contain 7 to 32 valid phone characters.")
        String phoneNumber,

        @Email(message = "Email must be valid.")
        @Size(max = 160, message = "Email must be 160 characters or fewer.")
        String email,

        @NotBlank(message = "Service needed is required.")
        @Size(max = 160, message = "Service needed must be 160 characters or fewer.")
        String serviceNeeded,

        @NotBlank(message = "Urgency is required.")
        @Size(max = 40, message = "Urgency must be 40 characters or fewer.")
        String urgency,

        @NotNull(message = "Status is required.")
        LeadStatus status,

        @DecimalMin(value = "0.00", message = "Estimated value cannot be negative.")
        @Digits(integer = 10, fraction = 2, message = "Estimated value must be a valid amount.")
        BigDecimal estimatedValue,

        @Size(max = 2000, message = "Notes must be 2000 characters or fewer.")
        String notes) {
}

