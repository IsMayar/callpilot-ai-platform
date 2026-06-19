CREATE TABLE ai_receptionist_configs (
    id UUID PRIMARY KEY,
    business_id UUID NOT NULL UNIQUE,
    greeting_message VARCHAR(1000) NOT NULL,
    after_hours_message VARCHAR(1000) NOT NULL,
    emergency_instructions VARCHAR(2000) NOT NULL,
    booking_rules VARCHAR(4000) NOT NULL,
    services_offered VARCHAR(4000) NOT NULL,
    fallback_phone_number VARCHAR(32),
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT fk_ai_receptionist_configs_business
        FOREIGN KEY (business_id)
        REFERENCES businesses(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_ai_receptionist_configs_business ON ai_receptionist_configs(business_id);
