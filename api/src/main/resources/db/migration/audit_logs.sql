CREATE TABLE audit_logs
(
    id             UUID NOT NULL,

    entity_type    VARCHAR(100) NOT NULL,
    entity_id      VARCHAR(100) NOT NULL,

    action         VARCHAR(20)  NOT NULL,
    old_values     JSONB,
    new_values     JSONB,
    changed_fields TEXT[],

    actor_id       UUID NOT NULL,
    actor_type     VARCHAR(50),
    trace_id       VARCHAR(100),
    ip_address     INET,
    metadata       JSONB,

    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_audit_logs_id PRIMARY KEY (id),
    CONSTRAINT fk_audit_logs_actor_id FOREIGN KEY (actor_id) REFERENCES users(id)
);

CREATE INDEX idx_audit_entity ON audit_logs (entity_type, entity_id, created_at DESC);
CREATE INDEX idx_audit_actor ON audit_logs (actor_id, created_at DESC);
CREATE INDEX idx_audit_created_at ON audit_logs (created_at DESC);
