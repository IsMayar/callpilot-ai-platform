package com.callpilotai.appointments;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {

    Page<Appointment> findByBusinessId(UUID businessId, Pageable pageable);

    Page<Appointment> findByBusinessIdAndStatus(UUID businessId, AppointmentStatus status, Pageable pageable);

    long countByBusinessIdAndStatus(UUID businessId, AppointmentStatus status);

    Optional<Appointment> findByIdAndBusinessId(UUID id, UUID businessId);

    Optional<Appointment> findByBusinessIdAndTitle(UUID businessId, String title);
}
