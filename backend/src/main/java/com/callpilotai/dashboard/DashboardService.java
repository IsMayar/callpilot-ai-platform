package com.callpilotai.dashboard;

import com.callpilotai.appointments.AppointmentRepository;
import com.callpilotai.appointments.AppointmentStatus;
import com.callpilotai.business.Business;
import com.callpilotai.business.BusinessRepository;
import com.callpilotai.business.exception.BusinessNotFoundException;
import com.callpilotai.calls.CallRecordRepository;
import com.callpilotai.calls.CallStatus;
import com.callpilotai.dashboard.dto.DashboardSummaryResponse;
import com.callpilotai.leads.LeadRepository;
import com.callpilotai.leads.LeadStatus;
import java.math.BigDecimal;
import java.time.DateTimeException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DashboardService {

    private final AppointmentRepository appointmentRepository;
    private final BusinessRepository businessRepository;
    private final CallRecordRepository callRecordRepository;
    private final LeadRepository leadRepository;

    public DashboardService(
            AppointmentRepository appointmentRepository,
            BusinessRepository businessRepository,
            CallRecordRepository callRecordRepository,
            LeadRepository leadRepository) {
        this.appointmentRepository = appointmentRepository;
        this.businessRepository = businessRepository;
        this.callRecordRepository = callRecordRepository;
        this.leadRepository = leadRepository;
    }

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getSummary(String ownerSubject) {
        Business business = businessRepository.findByOwnerSubject(ownerSubject)
                .orElseThrow(BusinessNotFoundException::new);
        Instant startOfToday = startOfToday(business.getTimezone());
        BigDecimal estimatedRevenueSaved = leadRepository.sumEstimatedValueByBusinessIdAndStatusIn(
                business.getId(),
                List.of(LeadStatus.BOOKED, LeadStatus.CLOSED));

        return new DashboardSummaryResponse(
                toInt(callRecordRepository.countByBusinessIdAndCreatedAtGreaterThanEqual(
                        business.getId(),
                        startOfToday)),
                toInt(leadRepository.countByBusinessIdAndStatus(business.getId(), LeadStatus.NEW)),
                toInt(appointmentRepository.countByBusinessIdAndStatus(
                        business.getId(),
                        AppointmentStatus.SCHEDULED)),
                toInt(callRecordRepository.countByBusinessIdAndCallStatusIn(
                        business.getId(),
                        List.of(CallStatus.ANSWERED_BY_AI, CallStatus.COMPLETED))),
                estimatedRevenueSaved == null ? BigDecimal.ZERO : estimatedRevenueSaved);
    }

    private Instant startOfToday(String timezone) {
        try {
            return LocalDate.now(ZoneId.of(timezone))
                    .atStartOfDay(ZoneId.of(timezone))
                    .toInstant();
        } catch (DateTimeException exception) {
            return LocalDate.now(ZoneId.of("UTC"))
                    .atStartOfDay(ZoneId.of("UTC"))
                    .toInstant();
        }
    }

    private int toInt(long value) {
        return value > Integer.MAX_VALUE ? Integer.MAX_VALUE : (int) value;
    }
}
