package com.callpilotai.business;

import com.callpilotai.business.dto.BusinessRequest;
import com.callpilotai.business.dto.BusinessResponse;
import com.callpilotai.business.exception.BusinessAlreadyExistsException;
import com.callpilotai.business.exception.BusinessNotFoundException;
import com.callpilotai.business.exception.InvalidTimezoneException;
import java.time.DateTimeException;
import java.time.ZoneId;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BusinessService {

    private final BusinessRepository businessRepository;

    public BusinessService(BusinessRepository businessRepository) {
        this.businessRepository = businessRepository;
    }

    @Transactional
    public BusinessResponse createBusiness(String ownerSubject, BusinessRequest request) {
        if (businessRepository.existsByOwnerSubject(ownerSubject)) {
            throw new BusinessAlreadyExistsException();
        }

        NormalizedBusiness normalized = normalize(request);
        Business business = new Business(
                ownerSubject,
                normalized.name(),
                normalized.industry(),
                normalized.phoneNumber(),
                normalized.timezone());

        return BusinessMapper.toResponse(businessRepository.save(business));
    }

    @Transactional(readOnly = true)
    public BusinessResponse getCurrentBusiness(String ownerSubject) {
        return businessRepository.findByOwnerSubject(ownerSubject)
                .map(BusinessMapper::toResponse)
                .orElseThrow(BusinessNotFoundException::new);
    }

    @Transactional
    public BusinessResponse updateBusiness(UUID id, String ownerSubject, BusinessRequest request) {
        Business business = businessRepository.findByIdAndOwnerSubject(id, ownerSubject)
                .orElseThrow(BusinessNotFoundException::new);
        NormalizedBusiness normalized = normalize(request);

        business.update(
                normalized.name(),
                normalized.industry(),
                normalized.phoneNumber(),
                normalized.timezone());

        return BusinessMapper.toResponse(business);
    }

    private NormalizedBusiness normalize(BusinessRequest request) {
        return new NormalizedBusiness(
                request.name().trim(),
                request.industry().trim(),
                request.phoneNumber().trim(),
                normalizeTimezone(request.timezone()));
    }

    private String normalizeTimezone(String timezone) {
        try {
            return ZoneId.of(timezone.trim()).getId();
        } catch (DateTimeException exception) {
            throw new InvalidTimezoneException(timezone);
        }
    }

    private record NormalizedBusiness(
            String name,
            String industry,
            String phoneNumber,
            String timezone) {
    }
}

