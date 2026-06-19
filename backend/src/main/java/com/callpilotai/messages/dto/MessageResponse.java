package com.callpilotai.messages.dto;

import com.callpilotai.messages.MessageChannel;
import com.callpilotai.messages.MessageDirection;
import com.callpilotai.messages.MessageStatus;
import java.time.Instant;
import java.util.UUID;

public record MessageResponse(
        UUID id,
        UUID businessId,
        UUID customerId,
        UUID leadId,
        MessageDirection direction,
        MessageChannel channel,
        String body,
        MessageStatus status,
        Instant sentAt,
        Instant createdAt) {
}

