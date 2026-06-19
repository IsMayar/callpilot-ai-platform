package com.callpilotai.messages.dto;

import com.callpilotai.messages.MessageChannel;
import com.callpilotai.messages.MessageDirection;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record MessageRequest(
        UUID customerId,
        UUID leadId,

        @NotNull(message = "Direction is required.")
        MessageDirection direction,

        @NotNull(message = "Channel is required.")
        MessageChannel channel,

        @NotBlank(message = "Message body is required.")
        @Size(max = 2000, message = "Message body must be 2000 characters or fewer.")
        String body) {
}

