package com.callpilotai.customers.dto;

import java.time.Instant;
import java.util.UUID;

public record CustomerResponse(
        UUID id,
        UUID businessId,
        String fullName,
        String phoneNumber,
        String email,
        String address,
        String notes,
        Instant createdAt,
        Instant updatedAt) {
}

