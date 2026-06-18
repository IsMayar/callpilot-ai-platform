package com.callpilotai.business.dto;

import java.time.Instant;
import java.util.UUID;

public record BusinessResponse(
        UUID id,
        String name,
        String industry,
        String phoneNumber,
        String timezone,
        Instant createdAt,
        Instant updatedAt) {
}

