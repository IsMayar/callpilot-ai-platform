package com.callpilotai.billing;

import com.callpilotai.billing.dto.SubscriptionPlanResponse;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/billing")
public class SubscriptionPlanController {

    private final SubscriptionPlanService subscriptionPlanService;

    public SubscriptionPlanController(SubscriptionPlanService subscriptionPlanService) {
        this.subscriptionPlanService = subscriptionPlanService;
    }

    @GetMapping("/current-plan")
    public SubscriptionPlanResponse getCurrentPlan(Authentication authentication) {
        return subscriptionPlanService.getCurrentPlan(authentication.getName());
    }
}
