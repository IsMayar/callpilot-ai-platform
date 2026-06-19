package com.callpilotai.billing.dto;

import com.callpilotai.billing.SubscriptionPlanStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record SubscriptionPlanResponse(
        UUID id,
        UUID businessId,
        String planName,
        SubscriptionPlanStatus status,
        BigDecimal monthlyPrice,
        Instant startedAt,
        Instant renewsAt,
        Instant createdAt,
        Instant updatedAt) {
}
