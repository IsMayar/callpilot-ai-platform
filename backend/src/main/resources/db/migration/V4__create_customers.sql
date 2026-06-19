CREATE TABLE customers (
    id UUID PRIMARY KEY,
    business_id UUID NOT NULL,
    full_name VARCHAR(160) NOT NULL,
    phone_number VARCHAR(32) NOT NULL,
    email VARCHAR(160),
    address VARCHAR(320),
    notes VARCHAR(2000),
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT fk_customers_business
        FOREIGN KEY (business_id)
        REFERENCES businesses(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_customers_business_created_at ON customers(business_id, created_at DESC);
CREATE INDEX idx_customers_business_full_name ON customers(business_id, full_name);
CREATE INDEX idx_customers_business_phone_number ON customers(business_id, phone_number);
CREATE INDEX idx_customers_business_email ON customers(business_id, email);

