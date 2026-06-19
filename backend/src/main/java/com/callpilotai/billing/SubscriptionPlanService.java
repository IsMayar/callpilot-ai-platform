package com.callpilotai.billing;

import com.callpilotai.billing.dto.SubscriptionPlanResponse;
import com.callpilotai.business.Business;
import com.callpilotai.business.BusinessRepository;
import com.callpilotai.business.exception.BusinessNotFoundException;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SubscriptionPlanService {

    private final BusinessRepository businessRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;

    public SubscriptionPlanService(
            BusinessRepository businessRepository,
            SubscriptionPlanRepository subscriptionPlanRepository) {
        this.businessRepository = businessRepository;
        this.subscriptionPlanRepository = subscriptionPlanRepository;
    }

    @Transactional
    public SubscriptionPlanResponse getCurrentPlan(String ownerSubject) {
        Business business = businessRepository.findByOwnerSubject(ownerSubject)
                .orElseThrow(BusinessNotFoundException::new);
        SubscriptionPlan subscriptionPlan = subscriptionPlanRepository.findByBusinessId(business.getId())
                .orElseGet(() -> subscriptionPlanRepository.save(defaultPlan(business)));

        return SubscriptionPlanMapper.toResponse(subscriptionPlan);
    }

    private SubscriptionPlan defaultPlan(Business business) {
        Instant now = Instant.now();

        return new SubscriptionPlan(
                business,
                "Launch Trial",
                SubscriptionPlanStatus.TRIAL,
                BigDecimal.ZERO,
                now,
                now.plus(14, ChronoUnit.DAYS));
    }
}
