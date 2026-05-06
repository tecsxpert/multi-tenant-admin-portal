CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    action VARCHAR(255) NOT NULL,
    entity_name VARCHAR(100) NOT NULL,
    entity_id LONG,
    performed_by VARCHAR(255),
    details TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_log_action ON audit_logs(action);
CREATE INDEX idx_audit_log_entity ON audit_logs(entity_name, entity_id);
