package com.callpilotai.calls.dto;

import com.callpilotai.calls.CallStatus;
import java.time.Instant;
import java.util.UUID;

public record CallRecordResponse(
        UUID id,
        UUID businessId,
        UUID customerId,
        UUID leadId,
        String callerPhone,
        CallStatus callStatus,
        int durationSeconds,
        String transcript,
        String aiSummary,
        String intent,
        String urgency,
        String recordingUrl,
        Instant createdAt) {
}

