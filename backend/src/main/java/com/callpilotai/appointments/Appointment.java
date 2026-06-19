package com.callpilotai.appointments;

import com.callpilotai.business.Business;
import com.callpilotai.customers.Customer;
import com.callpilotai.leads.Lead;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id")
    private Lead lead;

    @Column(name = "title", nullable = false, length = 160)
    private String title;

    @Column(name = "description", length = 2000)
    private String description;

    @Column(name = "scheduled_start", nullable = false)
    private Instant scheduledStart;

    @Column(name = "scheduled_end", nullable = false)
    private Instant scheduledEnd;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private AppointmentStatus status;

    @Column(name = "address", length = 320)
    private String address;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Appointment() {
    }

    public Appointment(
            Business business,
            Customer customer,
            Lead lead,
            String title,
            String description,
            Instant scheduledStart,
            Instant scheduledEnd,
            AppointmentStatus status,
            String address) {
        this.business = business;
        this.customer = customer;
        this.lead = lead;
        this.title = title;
        this.description = description;
        this.scheduledStart = scheduledStart;
        this.scheduledEnd = scheduledEnd;
        this.status = status;
        this.address = address;
    }

    @PrePersist
    void prePersist() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    public UUID getId() {
        return id;
    }

    public Business getBusiness() {
        return business;
    }

    public Customer getCustomer() {
        return customer;
    }

    public Lead getLead() {
        return lead;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Instant getScheduledStart() {
        return scheduledStart;
    }

    public Instant getScheduledEnd() {
        return scheduledEnd;
    }

    public AppointmentStatus getStatus() {
        return status;
    }

    public String getAddress() {
        return address;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void update(
            Customer customer,
            Lead lead,
            String title,
            String description,
            Instant scheduledStart,
            Instant scheduledEnd,
            AppointmentStatus status,
            String address) {
        this.customer = customer;
        this.lead = lead;
        this.title = title;
        this.description = description;
        this.scheduledStart = scheduledStart;
        this.scheduledEnd = scheduledEnd;
        this.status = status;
        this.address = address;
        this.updatedAt = Instant.now();
    }
}

