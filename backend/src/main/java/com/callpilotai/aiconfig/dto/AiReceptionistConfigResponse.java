package com.callpilotai.aiconfig.dto;

import java.time.Instant;
import java.util.UUID;

public record AiReceptionistConfigResponse(
        UUID id,
        UUID businessId,
        String greetingMessage,
        String afterHoursMessage,
        String emergencyInstructions,
        String bookingRules,
        String servicesOffered,
        String fallbackPhoneNumber,
        Instant createdAt,
        Instant updatedAt) {
}
