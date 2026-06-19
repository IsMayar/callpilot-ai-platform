package com.callpilotai.appointments;

import com.callpilotai.appointments.dto.AppointmentRequest;
import com.callpilotai.appointments.dto.AppointmentResponse;
import com.callpilotai.appointments.exception.AppointmentNotFoundException;
import com.callpilotai.appointments.exception.InvalidAppointmentScheduleException;
import com.callpilotai.business.Business;
import com.callpilotai.business.BusinessRepository;
import com.callpilotai.business.exception.BusinessNotFoundException;
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
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final BusinessRepository businessRepository;
    private final CustomerRepository customerRepository;
    private final LeadRepository leadRepository;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            BusinessRepository businessRepository,
            CustomerRepository customerRepository,
            LeadRepository leadRepository) {
        this.appointmentRepository = appointmentRepository;
        this.businessRepository = businessRepository;
        this.customerRepository = customerRepository;
        this.leadRepository = leadRepository;
    }

    @Transactional(readOnly = true)
    public Page<AppointmentResponse> getAppointments(
            String ownerSubject,
            AppointmentStatus status,
            Pageable pageable) {
        Business business = currentBusiness(ownerSubject);
        Page<Appointment> appointments = status == null
                ? appointmentRepository.findByBusinessId(business.getId(), pageable)
                : appointmentRepository.findByBusinessIdAndStatus(business.getId(), status, pageable);

        return appointments.map(AppointmentMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public AppointmentResponse getAppointment(UUID id, String ownerSubject) {
        Business business = currentBusiness(ownerSubject);
        Appointment appointment = appointmentRepository.findByIdAndBusinessId(id, business.getId())
                .orElseThrow(AppointmentNotFoundException::new);

        return AppointmentMapper.toResponse(appointment);
    }

    @Transactional
    public AppointmentResponse createAppointment(String ownerSubject, AppointmentRequest request) {
        Business business = currentBusiness(ownerSubject);
        validateSchedule(request);
        Customer customer = findCustomer(request.customerId(), business.getId());
        Lead lead = findLead(request.leadId(), business.getId());
        NormalizedAppointment normalized = normalize(request);
        Appointment appointment = new Appointment(
                business,
                customer,
                lead,
                normalized.title(),
                normalized.description(),
                normalized.scheduledStart(),
                normalized.scheduledEnd(),
                normalized.status(),
                normalized.address());

        return AppointmentMapper.toResponse(appointmentRepository.save(appointment));
    }

    @Transactional
    public AppointmentResponse updateAppointment(UUID id, String ownerSubject, AppointmentRequest request) {
        Business business = currentBusiness(ownerSubject);
        validateSchedule(request);
        Appointment appointment = appointmentRepository.findByIdAndBusinessId(id, business.getId())
                .orElseThrow(AppointmentNotFoundException::new);
        Customer customer = findCustomer(request.customerId(), business.getId());
        Lead lead = findLead(request.leadId(), business.getId());
        NormalizedAppointment normalized = normalize(request);

        appointment.update(
                customer,
                lead,
                normalized.title(),
                normalized.description(),
                normalized.scheduledStart(),
                normalized.scheduledEnd(),
                normalized.status(),
                normalized.address());

        return AppointmentMapper.toResponse(appointment);
    }

    @Transactional
    public void deleteAppointment(UUID id, String ownerSubject) {
        Business business = currentBusiness(ownerSubject);
        Appointment appointment = appointmentRepository.findByIdAndBusinessId(id, business.getId())
                .orElseThrow(AppointmentNotFoundException::new);

        appointmentRepository.delete(appointment);
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

    private void validateSchedule(AppointmentRequest request) {
        if (!request.scheduledEnd().isAfter(request.scheduledStart())) {
            throw new InvalidAppointmentScheduleException();
        }
    }

    private NormalizedAppointment normalize(AppointmentRequest request) {
        return new NormalizedAppointment(
                request.title().trim(),
                normalizeNullable(request.description()),
                request.scheduledStart(),
                request.scheduledEnd(),
                request.status(),
                normalizeNullable(request.address()));
    }

    private String normalizeNullable(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private record NormalizedAppointment(
            String title,
            String description,
            java.time.Instant scheduledStart,
            java.time.Instant scheduledEnd,
            AppointmentStatus status,
            String address) {
    }
}

