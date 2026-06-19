package com.callpilotai.leads.dto;

import com.callpilotai.leads.LeadStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record LeadResponse(
        UUID id,
        UUID businessId,
        String customerName,
        String phoneNumber,
        String email,
        String serviceNeeded,
        String urgency,
        LeadStatus status,
        BigDecimal estimatedValue,
        String notes,
        Instant createdAt,
        Instant updatedAt) {
}

