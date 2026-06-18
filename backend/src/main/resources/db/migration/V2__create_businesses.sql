CREATE TABLE businesses (
    id UUID PRIMARY KEY,
    owner_subject VARCHAR(160) NOT NULL,
    name VARCHAR(160) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    phone_number VARCHAR(32) NOT NULL,
    timezone VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT uk_businesses_owner_subject UNIQUE (owner_subject)
);
