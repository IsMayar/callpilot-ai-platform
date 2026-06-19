package com.callpilotai.appointments;

import com.callpilotai.appointments.dto.AppointmentRequest;
import com.callpilotai.appointments.dto.AppointmentResponse;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Validated
@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping
    public Page<AppointmentResponse> getAppointments(
            @RequestParam(required = false) AppointmentStatus status,
            @PageableDefault(size = 10, sort = "scheduledStart", direction = Sort.Direction.ASC) Pageable pageable,
            Authentication authentication) {
        return appointmentService.getAppointments(ownerSubject(authentication), status, pageable);
    }

    @GetMapping("/{id}")
    public AppointmentResponse getAppointment(@PathVariable UUID id, Authentication authentication) {
        return appointmentService.getAppointment(id, ownerSubject(authentication));
    }

    @PostMapping
    public ResponseEntity<AppointmentResponse> createAppointment(
            @Valid @RequestBody AppointmentRequest request,
            Authentication authentication) {
        AppointmentResponse response = appointmentService.createAppointment(ownerSubject(authentication), request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();

        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/{id}")
    public AppointmentResponse updateAppointment(
            @PathVariable UUID id,
            @Valid @RequestBody AppointmentRequest request,
            Authentication authentication) {
        return appointmentService.updateAppointment(id, ownerSubject(authentication), request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable UUID id, Authentication authentication) {
        appointmentService.deleteAppointment(id, ownerSubject(authentication));
        return ResponseEntity.noContent().build();
    }

    private String ownerSubject(Authentication authentication) {
        return authentication.getName();
    }
}

