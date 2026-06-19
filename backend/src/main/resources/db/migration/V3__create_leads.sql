CREATE TABLE leads (
    id UUID PRIMARY KEY,
    business_id UUID NOT NULL,
    customer_name VARCHAR(160) NOT NULL,
    phone_number VARCHAR(32) NOT NULL,
    email VARCHAR(160),
    service_needed VARCHAR(160) NOT NULL,
    urgency VARCHAR(40) NOT NULL,
    status VARCHAR(20) NOT NULL,
    estimated_value NUMERIC(12, 2) NOT NULL DEFAULT 0,
    notes VARCHAR(2000),
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT fk_leads_business
        FOREIGN KEY (business_id)
        REFERENCES businesses(id)
        ON DELETE CASCADE,
    CONSTRAINT ck_leads_status
        CHECK (status IN ('NEW', 'CONTACTED', 'BOOKED', 'CLOSED', 'LOST')),
    CONSTRAINT ck_leads_estimated_value
        CHECK (estimated_value >= 0)
);

CREATE INDEX idx_leads_business_created_at ON leads(business_id, created_at DESC);
CREATE INDEX idx_leads_business_status ON leads(business_id, status);
CREATE INDEX idx_leads_business_customer_name ON leads(business_id, customer_name);

