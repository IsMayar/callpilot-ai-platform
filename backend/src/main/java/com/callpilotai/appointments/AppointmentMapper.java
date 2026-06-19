package com.callpilotai.appointments;

import com.callpilotai.appointments.dto.AppointmentResponse;
import java.util.Optional;

final class AppointmentMapper {

    private AppointmentMapper() {
    }

    static AppointmentResponse toResponse(Appointment appointment) {
        return new AppointmentResponse(
                appointment.getId(),
                appointment.getBusiness().getId(),
                Optional.ofNullable(appointment.getCustomer()).map(customer -> customer.getId()).orElse(null),
                Optional.ofNullable(appointment.getLead()).map(lead -> lead.getId()).orElse(null),
                appointment.getTitle(),
                appointment.getDescription(),
                appointment.getScheduledStart(),
                appointment.getScheduledEnd(),
                appointment.getStatus(),
                appointment.getAddress(),
                appointment.getCreatedAt(),
                appointment.getUpdatedAt());
    }
}

