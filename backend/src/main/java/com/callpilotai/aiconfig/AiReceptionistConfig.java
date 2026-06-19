package com.callpilotai.aiconfig;

import com.callpilotai.business.Business;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "ai_receptionist_configs")
public class AiReceptionistConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;

    @Column(name = "greeting_message", nullable = false, length = 1000)
    private String greetingMessage;

    @Column(name = "after_hours_message", nullable = false, length = 1000)
    private String afterHoursMessage;

    @Column(name = "emergency_instructions", nullable = false, length = 2000)
    private String emergencyInstructions;

    @Column(name = "booking_rules", nullable = false, length = 4000)
    private String bookingRules;

    @Column(name = "services_offered", nullable = false, length = 4000)
    private String servicesOffered;

    @Column(name = "fallback_phone_number", length = 32)
    private String fallbackPhoneNumber;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected AiReceptionistConfig() {
    }

    public AiReceptionistConfig(
            Business business,
            String greetingMessage,
            String afterHoursMessage,
            String emergencyInstructions,
            String bookingRules,
            String servicesOffered,
            String fallbackPhoneNumber) {
        this.business = business;
        this.greetingMessage = greetingMessage;
        this.afterHoursMessage = afterHoursMessage;
        this.emergencyInstructions = emergencyInstructions;
        this.bookingRules = bookingRules;
        this.servicesOffered = servicesOffered;
        this.fallbackPhoneNumber = fallbackPhoneNumber;
    }

    @PrePersist
    void prePersist() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public Business getBusiness() {
        return business;
    }

    public String getGreetingMessage() {
        return greetingMessage;
    }

    public String getAfterHoursMessage() {
        return afterHoursMessage;
    }

    public String getEmergencyInstructions() {
        return emergencyInstructions;
    }

    public String getBookingRules() {
        return bookingRules;
    }

    public String getServicesOffered() {
        return servicesOffered;
    }

    public String getFallbackPhoneNumber() {
        return fallbackPhoneNumber;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void update(
            String greetingMessage,
            String afterHoursMessage,
            String emergencyInstructions,
            String bookingRules,
            String servicesOffered,
            String fallbackPhoneNumber) {
        this.greetingMessage = greetingMessage;
        this.afterHoursMessage = afterHoursMessage;
        this.emergencyInstructions = emergencyInstructions;
        this.bookingRules = bookingRules;
        this.servicesOffered = servicesOffered;
        this.fallbackPhoneNumber = fallbackPhoneNumber;
        this.updatedAt = Instant.now();
    }
}
