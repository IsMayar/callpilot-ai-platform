package com.callpilotai.business;

import com.callpilotai.business.dto.BusinessResponse;

final class BusinessMapper {

    private BusinessMapper() {
    }

    static BusinessResponse toResponse(Business business) {
        return new BusinessResponse(
                business.getId(),
                business.getName(),
                business.getIndustry(),
                business.getPhoneNumber(),
                business.getTimezone(),
                business.getCreatedAt(),
                business.getUpdatedAt());
    }
}

