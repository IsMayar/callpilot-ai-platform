package com.callpilotai.calls.dto;

import com.callpilotai.calls.CallStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record CallRecordRequest(
        UUID customerId,
        UUID leadId,

        @NotBlank(message = "Caller phone is required.")
        @Size(max = 32, message = "Caller phone must be 32 characters or fewer.")
        @Pattern(
                regexp = "^\\+?[0-9 .()\\-]{7,32}$",
                message = "Caller phone must contain 7 to 32 valid phone characters.")
        String callerPhone,

        @NotNull(message = "Call status is required.")
        CallStatus callStatus,

        @Min(value = 0, message = "Duration cannot be negative.")
        Integer durationSeconds,

        @Size(max = 10000, message = "Transcript must be 10000 characters or fewer.")
        String transcript,

        @Size(max = 4000, message = "AI summary must be 4000 characters or fewer.")
        String aiSummary,

        @Size(max = 120, message = "Intent must be 120 characters or fewer.")
        String intent,

        @Size(max = 40, message = "Urgency must be 40 characters or fewer.")
        String urgency,

        @Size(max = 500, message = "Recording URL must be 500 characters or fewer.")
        String recordingUrl) {
}

