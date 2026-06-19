package com.callpilotai.dashboard.dto;

import java.math.BigDecimal;

public record DashboardSummaryResponse(
        int callsToday,
        int newLeads,
        int appointmentsBooked,
        int missedCallsRecovered,
        BigDecimal estimatedRevenueSaved) {
}

