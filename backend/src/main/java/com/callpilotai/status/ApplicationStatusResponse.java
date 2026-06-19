package com.callpilotai.status;

import java.time.Instant;

public record ApplicationStatusResponse(
        String status,
        String application,
        Instant timestamp) {
}
