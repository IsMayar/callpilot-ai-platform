CREATE TABLE team_members (
    id UUID PRIMARY KEY,
    business_id UUID NOT NULL,
    user_id VARCHAR(160),
    full_name VARCHAR(160) NOT NULL,
    email VARCHAR(160) NOT NULL,
    role VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT fk_team_members_business
        FOREIGN KEY (business_id)
        REFERENCES businesses(id)
        ON DELETE CASCADE,
    CONSTRAINT uq_team_members_business_email
        UNIQUE (business_id, email),
    CONSTRAINT ck_team_members_role
        CHECK (role IN ('OWNER', 'ADMIN', 'MANAGER', 'STAFF')),
    CONSTRAINT ck_team_members_status
        CHECK (status IN ('ACTIVE', 'INVITED', 'DISABLED'))
);

CREATE INDEX idx_team_members_business ON team_members(business_id);
CREATE INDEX idx_team_members_business_status ON team_members(business_id, status);
