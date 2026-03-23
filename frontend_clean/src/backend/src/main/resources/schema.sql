-- PostgreSQL compatible schema for Talent Portal

CREATE TABLE IF NOT EXISTS coding_questions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL,
    difficulty_level VARCHAR(50) NOT NULL,
    programming_language VARCHAR(50) NOT NULL,
    time_limit_minutes INT NOT NULL,
    sample_input TEXT,
    expected_output TEXT,
    constraints TEXT,
    hints TEXT,
    solution_code TEXT,
    test_cases JSONB,
    points INT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
