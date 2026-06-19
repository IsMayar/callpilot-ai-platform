package com.callpilotai.leads;

import com.callpilotai.leads.dto.LeadResponse;

final class LeadMapper {

    private LeadMapper() {
    }

    static LeadResponse toResponse(Lead lead) {
        return new LeadResponse(
                lead.getId(),
                lead.getBusiness().getId(),
                lead.getCustomerName(),
                lead.getPhoneNumber(),
                lead.getEmail(),
                lead.getServiceNeeded(),
                lead.getUrgency(),
                lead.getStatus(),
                lead.getEstimatedValue(),
                lead.getNotes(),
                lead.getCreatedAt(),
                lead.getUpdatedAt());
    }
}

