CREATE TABLE call_records (
    id UUID PRIMARY KEY,
    business_id UUID NOT NULL,
    customer_id UUID,
    lead_id UUID,
    caller_phone VARCHAR(32) NOT NULL,
    call_status VARCHAR(32) NOT NULL,
    duration_seconds INTEGER NOT NULL DEFAULT 0,
    transcript VARCHAR(10000),
    ai_summary VARCHAR(4000),
    intent VARCHAR(120),
    urgency VARCHAR(40),
    recording_url VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT fk_call_records_business
        FOREIGN KEY (business_id)
        REFERENCES businesses(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_call_records_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_call_records_lead
        FOREIGN KEY (lead_id)
        REFERENCES leads(id)
        ON DELETE SET NULL,
    CONSTRAINT ck_call_records_status
        CHECK (call_status IN ('ANSWERED_BY_AI', 'MISSED', 'VOICEMAIL', 'ESCALATED', 'COMPLETED')),
    CONSTRAINT ck_call_records_duration
        CHECK (duration_seconds >= 0)
);

CREATE INDEX idx_call_records_business_created_at ON call_records(business_id, created_at DESC);
CREATE INDEX idx_call_records_business_status ON call_records(business_id, call_status);
CREATE INDEX idx_call_records_customer ON call_records(customer_id);
CREATE INDEX idx_call_records_lead ON call_records(lead_id);

