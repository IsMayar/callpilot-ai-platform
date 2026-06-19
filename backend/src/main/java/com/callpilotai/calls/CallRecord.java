package com.callpilotai.calls;

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
@Table(name = "call_records")
public class CallRecord {

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

    @Column(name = "caller_phone", nullable = false, length = 32)
    private String callerPhone;

    @Enumerated(EnumType.STRING)
    @Column(name = "call_status", nullable = false, length = 32)
    private CallStatus callStatus;

    @Column(name = "duration_seconds", nullable = false)
    private int durationSeconds;

    @Column(name = "transcript", length = 10000)
    private String transcript;

    @Column(name = "ai_summary", length = 4000)
    private String aiSummary;

    @Column(name = "intent", length = 120)
    private String intent;

    @Column(name = "urgency", length = 40)
    private String urgency;

    @Column(name = "recording_url", length = 500)
    private String recordingUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected CallRecord() {
    }

    public CallRecord(
            Business business,
            Customer customer,
            Lead lead,
            String callerPhone,
            CallStatus callStatus,
            int durationSeconds,
            String transcript,
            String aiSummary,
            String intent,
            String urgency,
            String recordingUrl) {
        this.business = business;
        this.customer = customer;
        this.lead = lead;
        this.callerPhone = callerPhone;
        this.callStatus = callStatus;
        this.durationSeconds = durationSeconds;
        this.transcript = transcript;
        this.aiSummary = aiSummary;
        this.intent = intent;
        this.urgency = urgency;
        this.recordingUrl = recordingUrl;
    }

    @PrePersist
    void prePersist() {
        createdAt = Instant.now();
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

    public String getCallerPhone() {
        return callerPhone;
    }

    public CallStatus getCallStatus() {
        return callStatus;
    }

    public int getDurationSeconds() {
        return durationSeconds;
    }

    public String getTranscript() {
        return transcript;
    }

    public String getAiSummary() {
        return aiSummary;
    }

    public String getIntent() {
        return intent;
    }

    public String getUrgency() {
        return urgency;
    }

    public String getRecordingUrl() {
        return recordingUrl;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}

