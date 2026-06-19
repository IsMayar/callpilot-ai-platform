package com.callpilotai.billing;

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
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "subscription_plans")
public class SubscriptionPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;

    @Column(name = "plan_name", nullable = false, length = 80)
    private String planName;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private SubscriptionPlanStatus status;

    @Column(name = "monthly_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal monthlyPrice;

    @Column(name = "started_at", nullable = false)
    private Instant startedAt;

    @Column(name = "renews_at", nullable = false)
    private Instant renewsAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected SubscriptionPlan() {
    }

    public SubscriptionPlan(
            Business business,
            String planName,
            SubscriptionPlanStatus status,
            BigDecimal monthlyPrice,
            Instant startedAt,
            Instant renewsAt) {
        this.business = business;
        this.planName = planName;
        this.status = status;
        this.monthlyPrice = monthlyPrice;
        this.startedAt = startedAt;
        this.renewsAt = renewsAt;
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

    public String getPlanName() {
        return planName;
    }

    public SubscriptionPlanStatus getStatus() {
        return status;
    }

    public BigDecimal getMonthlyPrice() {
        return monthlyPrice;
    }

    public Instant getStartedAt() {
        return startedAt;
    }

    public Instant getRenewsAt() {
        return renewsAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void update(
            String planName,
            SubscriptionPlanStatus status,
            BigDecimal monthlyPrice,
            Instant startedAt,
            Instant renewsAt) {
        this.planName = planName;
        this.status = status;
        this.monthlyPrice = monthlyPrice;
        this.startedAt = startedAt;
        this.renewsAt = renewsAt;
        this.updatedAt = Instant.now();
    }
}
