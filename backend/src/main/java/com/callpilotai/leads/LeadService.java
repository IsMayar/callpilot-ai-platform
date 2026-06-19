package com.callpilotai.leads;

import com.callpilotai.business.Business;
import com.callpilotai.business.BusinessRepository;
import com.callpilotai.business.exception.BusinessNotFoundException;
import com.callpilotai.leads.dto.LeadRequest;
import com.callpilotai.leads.dto.LeadResponse;
import com.callpilotai.leads.exception.LeadNotFoundException;
import java.math.BigDecimal;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LeadService {

    private final BusinessRepository businessRepository;
    private final LeadRepository leadRepository;

    public LeadService(BusinessRepository businessRepository, LeadRepository leadRepository) {
        this.businessRepository = businessRepository;
        this.leadRepository = leadRepository;
    }

    @Transactional(readOnly = true)
    public Page<LeadResponse> getLeads(String ownerSubject, String search, LeadStatus status, Pageable pageable) {
        Business business = currentBusiness(ownerSubject);
        String normalizedSearch = normalizeSearch(search);

        return leadRepository.searchByBusiness(business.getId(), normalizedSearch, status, pageable)
                .map(LeadMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public LeadResponse getLead(UUID id, String ownerSubject) {
        Business business = currentBusiness(ownerSubject);
        Lead lead = leadRepository.findByIdAndBusinessId(id, business.getId())
                .orElseThrow(LeadNotFoundException::new);

        return LeadMapper.toResponse(lead);
    }

    @Transactional
    public LeadResponse createLead(String ownerSubject, LeadRequest request) {
        Business business = currentBusiness(ownerSubject);
        NormalizedLead normalized = normalize(request);
        Lead lead = new Lead(
                business,
                normalized.customerName(),
                normalized.phoneNumber(),
                normalized.email(),
                normalized.serviceNeeded(),
                normalized.urgency(),
                normalized.status(),
                normalized.estimatedValue(),
                normalized.notes());

        return LeadMapper.toResponse(leadRepository.save(lead));
    }

    @Transactional
    public LeadResponse updateLead(UUID id, String ownerSubject, LeadRequest request) {
        Business business = currentBusiness(ownerSubject);
        Lead lead = leadRepository.findByIdAndBusinessId(id, business.getId())
                .orElseThrow(LeadNotFoundException::new);
        NormalizedLead normalized = normalize(request);

        lead.update(
                normalized.customerName(),
                normalized.phoneNumber(),
                normalized.email(),
                normalized.serviceNeeded(),
                normalized.urgency(),
                normalized.status(),
                normalized.estimatedValue(),
                normalized.notes());

        return LeadMapper.toResponse(lead);
    }

    @Transactional
    public void deleteLead(UUID id, String ownerSubject) {
        Business business = currentBusiness(ownerSubject);
        Lead lead = leadRepository.findByIdAndBusinessId(id, business.getId())
                .orElseThrow(LeadNotFoundException::new);

        leadRepository.delete(lead);
    }

    private Business currentBusiness(String ownerSubject) {
        return businessRepository.findByOwnerSubject(ownerSubject)
                .orElseThrow(BusinessNotFoundException::new);
    }

    private NormalizedLead normalize(LeadRequest request) {
        return new NormalizedLead(
                request.customerName().trim(),
                request.phoneNumber().trim(),
                normalizeNullable(request.email()),
                request.serviceNeeded().trim(),
                request.urgency().trim(),
                request.status(),
                request.estimatedValue() == null ? BigDecimal.ZERO : request.estimatedValue(),
                normalizeNullable(request.notes()));
    }

    private String normalizeSearch(String search) {
        String normalized = normalizeNullable(search);
        return normalized == null ? null : normalized.toLowerCase();
    }

    private String normalizeNullable(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private record NormalizedLead(
            String customerName,
            String phoneNumber,
            String email,
            String serviceNeeded,
            String urgency,
            LeadStatus status,
            BigDecimal estimatedValue,
            String notes) {
    }
}

