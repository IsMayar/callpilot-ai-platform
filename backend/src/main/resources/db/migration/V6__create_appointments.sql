CREATE TABLE appointments (
    id UUID PRIMARY KEY,
    business_id UUID NOT NULL,
    customer_id UUID,
    lead_id UUID,
    title VARCHAR(160) NOT NULL,
    description VARCHAR(2000),
    scheduled_start TIMESTAMPTZ NOT NULL,
    scheduled_end TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) NOT NULL,
    address VARCHAR(320),
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT fk_appointments_business
        FOREIGN KEY (business_id)
        REFERENCES businesses(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_appointments_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_appointments_lead
        FOREIGN KEY (lead_id)
        REFERENCES leads(id)
        ON DELETE SET NULL,
    CONSTRAINT ck_appointments_status
        CHECK (status IN ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW')),
    CONSTRAINT ck_appointments_schedule
        CHECK (scheduled_end > scheduled_start)
);

CREATE INDEX idx_appointments_business_start ON appointments(business_id, scheduled_start);
CREATE INDEX idx_appointments_business_status ON appointments(business_id, status);
CREATE INDEX idx_appointments_customer ON appointments(customer_id);
CREATE INDEX idx_appointments_lead ON appointments(lead_id);

