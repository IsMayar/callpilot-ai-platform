package com.callpilotai.calls;

import com.callpilotai.calls.dto.CallRecordResponse;
import java.util.Optional;

final class CallRecordMapper {

    private CallRecordMapper() {
    }

    static CallRecordResponse toResponse(CallRecord callRecord) {
        return new CallRecordResponse(
                callRecord.getId(),
                callRecord.getBusiness().getId(),
                Optional.ofNullable(callRecord.getCustomer()).map(customer -> customer.getId()).orElse(null),
                Optional.ofNullable(callRecord.getLead()).map(lead -> lead.getId()).orElse(null),
                callRecord.getCallerPhone(),
                callRecord.getCallStatus(),
                callRecord.getDurationSeconds(),
                callRecord.getTranscript(),
                callRecord.getAiSummary(),
                callRecord.getIntent(),
                callRecord.getUrgency(),
                callRecord.getRecordingUrl(),
                callRecord.getCreatedAt());
    }
}
