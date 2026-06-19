package com.callpilotai.aiconfig;

import com.callpilotai.aiconfig.dto.AiReceptionistConfigResponse;

final class AiReceptionistConfigMapper {

    private AiReceptionistConfigMapper() {
    }

    static AiReceptionistConfigResponse toResponse(AiReceptionistConfig config) {
        return new AiReceptionistConfigResponse(
                config.getId(),
                config.getBusiness().getId(),
                config.getGreetingMessage(),
                config.getAfterHoursMessage(),
                config.getEmergencyInstructions(),
                config.getBookingRules(),
                config.getServicesOffered(),
                config.getFallbackPhoneNumber(),
                config.getCreatedAt(),
                config.getUpdatedAt());
    }
}
