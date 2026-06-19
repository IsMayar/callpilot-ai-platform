package com.callpilotai.leads;

import com.callpilotai.business.Business;
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
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "leads")
public class Lead {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;

    @Column(name = "customer_name", nullable = false, length = 160)
    private String customerName;

    @Column(name = "phone_number", nullable = false, length = 32)
    private String phoneNumber;

    @Column(name = "email", length = 160)
    private String email;

    @Column(name = "service_needed", nullable = false, length = 160)
    private String serviceNeeded;

    @Column(name = "urgency", nullable = false, length = 40)
    private String urgency;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private LeadStatus status;

    @Column(name = "estimated_value", nullable = false, precision = 12, scale = 2)
    private BigDecimal estimatedValue;

    @Column(name = "notes", length = 2000)
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Lead() {
    }

    public Lead(
            Business business,
            String customerName,
            String phoneNumber,
            String email,
            String serviceNeeded,
            String urgency,
            LeadStatus status,
            BigDecimal estimatedValue,
            String notes) {
        this.business = business;
        this.customerName = customerName;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.serviceNeeded = serviceNeeded;
        this.urgency = urgency;
        this.status = status;
        this.estimatedValue = estimatedValue;
        this.notes = notes;
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

    public String getCustomerName() {
        return customerName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public String getServiceNeeded() {
        return serviceNeeded;
    }

    public String getUrgency() {
        return urgency;
    }

    public LeadStatus getStatus() {
        return status;
    }

    public BigDecimal getEstimatedValue() {
        return estimatedValue;
    }

    public String getNotes() {
        return notes;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void update(
            String customerName,
            String phoneNumber,
            String email,
            String serviceNeeded,
            String urgency,
            LeadStatus status,
            BigDecimal estimatedValue,
            String notes) {
        this.customerName = customerName;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.serviceNeeded = serviceNeeded;
        this.urgency = urgency;
        this.status = status;
        this.estimatedValue = estimatedValue;
        this.notes = notes;
        this.updatedAt = Instant.now();
    }
}

