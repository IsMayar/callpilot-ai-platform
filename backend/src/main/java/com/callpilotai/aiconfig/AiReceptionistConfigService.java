package com.callpilotai.aiconfig;

import com.callpilotai.aiconfig.dto.AiReceptionistConfigRequest;
import com.callpilotai.aiconfig.dto.AiReceptionistConfigResponse;
import com.callpilotai.business.Business;
import com.callpilotai.business.BusinessRepository;
import com.callpilotai.business.exception.BusinessNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AiReceptionistConfigService {

    private final AiReceptionistConfigRepository aiReceptionistConfigRepository;
    private final BusinessRepository businessRepository;

    public AiReceptionistConfigService(
            AiReceptionistConfigRepository aiReceptionistConfigRepository,
            BusinessRepository businessRepository) {
        this.aiReceptionistConfigRepository = aiReceptionistConfigRepository;
        this.businessRepository = businessRepository;
    }

    @Transactional
    public AiReceptionistConfigResponse getConfig(String ownerSubject) {
        Business business = currentBusiness(ownerSubject);
        AiReceptionistConfig config = aiReceptionistConfigRepository.findByBusinessId(business.getId())
                .orElseGet(() -> aiReceptionistConfigRepository.save(defaultConfig(business)));

        return AiReceptionistConfigMapper.toResponse(config);
    }

    @Transactional
    public AiReceptionistConfigResponse updateConfig(String ownerSubject, AiReceptionistConfigRequest request) {
        Business business = currentBusiness(ownerSubject);
        NormalizedAiReceptionistConfig normalized = normalize(request);
        AiReceptionistConfig config = aiReceptionistConfigRepository.findByBusinessId(business.getId())
                .orElseGet(() -> defaultConfig(business));

        config.update(
                normalized.greetingMessage(),
                normalized.afterHoursMessage(),
                normalized.emergencyInstructions(),
                normalized.bookingRules(),
                normalized.servicesOffered(),
                normalized.fallbackPhoneNumber());

        return AiReceptionistConfigMapper.toResponse(aiReceptionistConfigRepository.save(config));
    }

    private Business currentBusiness(String ownerSubject) {
        return businessRepository.findByOwnerSubject(ownerSubject)
                .orElseThrow(BusinessNotFoundException::new);
    }

    private AiReceptionistConfig defaultConfig(Business business) {
        return new AiReceptionistConfig(
                business,
                "Thanks for calling " + business.getName() + ". How can I help today?",
                "Thanks for calling " + business.getName() + ". We are currently closed, but I can still take your details.",
                "If the caller reports an emergency, advise them to contact emergency services immediately and notify the fallback contact.",
                "Collect the caller's name, phone number, requested service, preferred date, and preferred time before booking.",
                "General inquiries, service requests, appointment scheduling, and urgent call routing.",
                business.getPhoneNumber());
    }

    private NormalizedAiReceptionistConfig normalize(AiReceptionistConfigRequest request) {
        return new NormalizedAiReceptionistConfig(
                request.greetingMessage().trim(),
                request.afterHoursMessage().trim(),
                request.emergencyInstructions().trim(),
                request.bookingRules().trim(),
                request.servicesOffered().trim(),
                normalizeNullable(request.fallbackPhoneNumber()));
    }

    private String normalizeNullable(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private record NormalizedAiReceptionistConfig(
            String greetingMessage,
            String afterHoursMessage,
            String emergencyInstructions,
            String bookingRules,
            String servicesOffered,
            String fallbackPhoneNumber) {
    }
}
