package com.callpilotai.appointments.dto;

import com.callpilotai.appointments.AppointmentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.UUID;

public record AppointmentRequest(
        UUID customerId,
        UUID leadId,

        @NotBlank(message = "Title is required.")
        @Size(max = 160, message = "Title must be 160 characters or fewer.")
        String title,

        @Size(max = 2000, message = "Description must be 2000 characters or fewer.")
        String description,

        @NotNull(message = "Scheduled start is required.")
        Instant scheduledStart,

        @NotNull(message = "Scheduled end is required.")
        Instant scheduledEnd,

        @NotNull(message = "Status is required.")
        AppointmentStatus status,

        @Size(max = 320, message = "Address must be 320 characters or fewer.")
        String address) {
}

