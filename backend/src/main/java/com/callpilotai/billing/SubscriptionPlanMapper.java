package com.callpilotai.billing;

import com.callpilotai.billing.dto.SubscriptionPlanResponse;

final class SubscriptionPlanMapper {

    private SubscriptionPlanMapper() {
    }

    static SubscriptionPlanResponse toResponse(SubscriptionPlan subscriptionPlan) {
        return new SubscriptionPlanResponse(
                subscriptionPlan.getId(),
                subscriptionPlan.getBusiness().getId(),
                subscriptionPlan.getPlanName(),
                subscriptionPlan.getStatus(),
                subscriptionPlan.getMonthlyPrice(),
                subscriptionPlan.getStartedAt(),
                subscriptionPlan.getRenewsAt(),
                subscriptionPlan.getCreatedAt(),
                subscriptionPlan.getUpdatedAt());
    }
}
