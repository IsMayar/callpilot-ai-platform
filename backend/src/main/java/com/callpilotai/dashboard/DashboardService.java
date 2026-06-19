package com.callpilotai.dashboard;

import com.callpilotai.dashboard.dto.DashboardSummaryResponse;
import java.math.BigDecimal;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    public DashboardSummaryResponse getSummary() {
        return new DashboardSummaryResponse(
                24,
                8,
                5,
                11,
                new BigDecimal("1840.00"));
    }
}

