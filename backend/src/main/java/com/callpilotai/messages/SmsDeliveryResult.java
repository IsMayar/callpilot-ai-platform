package com.callpilotai.messages;

import java.time.Instant;

public record SmsDeliveryResult(
        MessageStatus status,
        Instant sentAt) {
}

