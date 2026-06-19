package com.callpilotai.calls;

import com.callpilotai.business.Business;
import com.callpilotai.business.BusinessRepository;
import com.callpilotai.business.exception.BusinessNotFoundException;
import com.callpilotai.calls.dto.CallRecordRequest;
import com.callpilotai.calls.dto.CallRecordResponse;
import com.callpilotai.calls.exception.CallRecordNotFoundException;
import com.callpilotai.customers.Customer;
import com.callpilotai.customers.CustomerRepository;
import com.callpilotai.customers.exception.CustomerNotFoundException;
import com.callpilotai.leads.Lead;
import com.callpilotai.leads.LeadRepository;
import com.callpilotai.leads.exception.LeadNotFoundException;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CallRecordService {

    private final AiSummaryService aiSummaryService;
    private final BusinessRepository businessRepository;
    private final CallRecordRepository callRecordRepository;
    private final CustomerRepository customerRepository;
    private final LeadRepository leadRepository;

    public CallRecordService(
            AiSummaryService aiSummaryService,
            BusinessRepository businessRepository,
            CallRecordRepository callRecordRepository,
            CustomerRepository customerRepository,
            LeadRepository leadRepository) {
        this.aiSummaryService = aiSummaryService;
        this.businessRepository = businessRepository;
        this.callRecordRepository = callRecordRepository;
        this.customerRepository = customerRepository;
        this.leadRepository = leadRepository;
    }

    @Transactional(readOnly = true)
    public Page<CallRecordResponse> getCallRecords(
            String ownerSubject,
            String search,
            CallStatus status,
            Pageable pageable) {
        Business business = currentBusiness(ownerSubject);
        String normalizedSearch = normalizeNullable(search);

        return findCallRecords(business.getId(), normalizedSearch, status, pageable)
                .map(CallRecordMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public CallRecordResponse getCallRecord(UUID id, String ownerSubject) {
        Business business = currentBusiness(ownerSubject);
        CallRecord callRecord = callRecordRepository.findByIdAndBusinessId(id, business.getId())
                .orElseThrow(CallRecordNotFoundException::new);

        return CallRecordMapper.toResponse(callRecord);
    }

    @Transactional
    public CallRecordResponse createCallRecord(String ownerSubject, CallRecordRequest request) {
        Business business = currentBusiness(ownerSubject);
        Customer customer = findCustomer(request.customerId(), business.getId());
        Lead lead = findLead(request.leadId(), business.getId());
        NormalizedCallRecord normalized = normalize(request);
        String aiSummary = normalized.aiSummary() == null
                ? aiSummaryService.generateSummary(normalized.transcript(), normalized.intent(), normalized.urgency())
                : normalized.aiSummary();
        CallRecord callRecord = new CallRecord(
                business,
                customer,
                lead,
                normalized.callerPhone(),
                normalized.callStatus(),
                normalized.durationSeconds(),
                normalized.transcript(),
                aiSummary,
                normalized.intent(),
                normalized.urgency(),
                normalized.recordingUrl());

        return CallRecordMapper.toResponse(callRecordRepository.save(callRecord));
    }

    private Page<CallRecord> findCallRecords(
            UUID businessId,
            String search,
            CallStatus status,
            Pageable pageable) {
        if (search != null && status != null) {
            return callRecordRepository.searchByBusinessIdAndStatus(businessId, status, search, pageable);
        }

        if (search != null) {
            return callRecordRepository.searchByBusinessId(businessId, search, pageable);
        }

        if (status != null) {
            return callRecordRepository.findByBusinessIdAndCallStatus(businessId, status, pageable);
        }

        return callRecordRepository.findByBusinessId(businessId, pageable);
    }

    private Business currentBusiness(String ownerSubject) {
        return businessRepository.findByOwnerSubject(ownerSubject)
                .orElseThrow(BusinessNotFoundException::new);
    }

    private Customer findCustomer(UUID customerId, UUID businessId) {
        if (customerId == null) {
            return null;
        }

        return customerRepository.findByIdAndBusinessId(customerId, businessId)
                .orElseThrow(CustomerNotFoundException::new);
    }

    private Lead findLead(UUID leadId, UUID businessId) {
        if (leadId == null) {
            return null;
        }

        return leadRepository.findByIdAndBusinessId(leadId, businessId)
                .orElseThrow(LeadNotFoundException::new);
    }

    private NormalizedCallRecord normalize(CallRecordRequest request) {
        return new NormalizedCallRecord(
                request.callerPhone().trim(),
                request.callStatus(),
                request.durationSeconds() == null ? 0 : request.durationSeconds(),
                normalizeNullable(request.transcript()),
                normalizeNullable(request.aiSummary()),
                normalizeNullable(request.intent()),
                normalizeNullable(request.urgency()),
                normalizeNullable(request.recordingUrl()));
    }

    private String normalizeNullable(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private record NormalizedCallRecord(
            String callerPhone,
            CallStatus callStatus,
            int durationSeconds,
            String transcript,
            String aiSummary,
            String intent,
            String urgency,
            String recordingUrl) {
    }
}

