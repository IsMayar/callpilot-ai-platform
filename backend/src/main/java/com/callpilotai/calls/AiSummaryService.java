package com.callpilotai.calls;

import org.springframework.stereotype.Service;

@Service
public class AiSummaryService {

    public String generateSummary(String transcript, String intent, String urgency) {
        String normalizedIntent = isBlank(intent) ? "General inquiry" : intent.trim();
        String normalizedUrgency = isBlank(urgency) ? "Medium" : urgency.trim();

        if (isBlank(transcript)) {
            return "AI summary pending. Intent: " + normalizedIntent + ". Urgency: " + normalizedUrgency + ".";
        }

        String trimmedTranscript = transcript.trim();
        String excerpt = trimmedTranscript.length() > 180
                ? trimmedTranscript.substring(0, 180) + "..."
                : trimmedTranscript;

        return "Caller intent: " + normalizedIntent
                + ". Urgency: " + normalizedUrgency
                + ". Summary: " + excerpt;
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}

