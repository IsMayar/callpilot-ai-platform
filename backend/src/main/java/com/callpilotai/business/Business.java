package com.callpilotai.business;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "businesses")
public class Business {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "owner_subject", nullable = false, unique = true, length = 160)
    private String ownerSubject;

    @Column(name = "name", nullable = false, length = 160)
    private String name;

    @Column(name = "industry", nullable = false, length = 100)
    private String industry;

    @Column(name = "phone_number", nullable = false, length = 32)
    private String phoneNumber;

    @Column(name = "timezone", nullable = false, length = 64)
    private String timezone;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Business() {
    }

    public Business(String ownerSubject, String name, String industry, String phoneNumber, String timezone) {
        this.ownerSubject = ownerSubject;
        this.name = name;
        this.industry = industry;
        this.phoneNumber = phoneNumber;
        this.timezone = timezone;
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

    public String getOwnerSubject() {
        return ownerSubject;
    }

    public String getName() {
        return name;
    }

    public String getIndustry() {
        return industry;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getTimezone() {
        return timezone;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void update(String name, String industry, String phoneNumber, String timezone) {
        this.name = name;
        this.industry = industry;
        this.phoneNumber = phoneNumber;
        this.timezone = timezone;
    }
}

