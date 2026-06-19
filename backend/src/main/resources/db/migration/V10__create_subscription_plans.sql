CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY,
    business_id UUID NOT NULL UNIQUE,
    plan_name VARCHAR(80) NOT NULL,
    status VARCHAR(20) NOT NULL,
    monthly_price NUMERIC(12, 2) NOT NULL,
    started_at TIMESTAMPTZ NOT NULL,
    renews_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT fk_subscription_plans_business
        FOREIGN KEY (business_id)
        REFERENCES businesses(id)
        ON DELETE CASCADE,
    CONSTRAINT ck_subscription_plans_status
        CHECK (status IN ('TRIAL', 'ACTIVE', 'PAST_DUE', 'CANCELLED')),
    CONSTRAINT ck_subscription_plans_price
        CHECK (monthly_price >= 0)
);

CREATE INDEX idx_subscription_plans_business ON subscription_plans(business_id);
