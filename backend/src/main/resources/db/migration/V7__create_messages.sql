CREATE TABLE messages (
    id UUID PRIMARY KEY,
    business_id UUID NOT NULL,
    customer_id UUID,
    lead_id UUID,
    direction VARCHAR(20) NOT NULL,
    channel VARCHAR(20) NOT NULL,
    body VARCHAR(2000) NOT NULL,
    status VARCHAR(20) NOT NULL,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT fk_messages_business
        FOREIGN KEY (business_id)
        REFERENCES businesses(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_messages_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_messages_lead
        FOREIGN KEY (lead_id)
        REFERENCES leads(id)
        ON DELETE SET NULL,
    CONSTRAINT ck_messages_direction
        CHECK (direction IN ('INBOUND', 'OUTBOUND')),
    CONSTRAINT ck_messages_channel
        CHECK (channel IN ('SMS')),
    CONSTRAINT ck_messages_status
        CHECK (status IN ('QUEUED', 'SENT', 'FAILED', 'RECEIVED'))
);

CREATE INDEX idx_messages_business_created_at ON messages(business_id, created_at DESC);
CREATE INDEX idx_messages_customer ON messages(customer_id);
CREATE INDEX idx_messages_lead ON messages(lead_id);

