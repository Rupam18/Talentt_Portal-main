-- Create violations table for proctoring (PostgreSQL)
CREATE TABLE IF NOT EXISTS violations (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    candidate_id VARCHAR(255) NOT NULL,
    test_id VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    suspicion_score INT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_candidate_id ON violations (candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_test ON violations (candidate_id, test_id);
