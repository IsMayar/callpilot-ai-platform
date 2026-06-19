package com.callpilotai.appointments.dto;

import com.callpilotai.appointments.AppointmentStatus;
import java.time.Instant;
import java.util.UUID;

public record AppointmentResponse(
        UUID id,
        UUID businessId,
        UUID customerId,
        UUID leadId,
        String title,
        String description,
        Instant scheduledStart,
        Instant scheduledEnd,
        AppointmentStatus status,
        String address,
        Instant createdAt,
        Instant updatedAt) {
}

