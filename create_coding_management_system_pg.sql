-- Complete Coding Test Management System (PostgreSQL)

-- Main coding results table
CREATE TABLE IF NOT EXISTS coding_results (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    question_text TEXT NOT NULL,
    user_code TEXT NOT NULL,
    language VARCHAR(50) NOT NULL,
    time_taken_seconds INT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    test_session_id VARCHAR(100) NOT NULL,
    is_correct BOOLEAN DEFAULT NULL,
    score DECIMAL(5,2) DEFAULT NULL,
    admin_feedback TEXT,
    admin_rating INT DEFAULT NULL,
    admin_reviewed_at TIMESTAMP NULL,
    admin_reviewer_id BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_coding_results_user_id ON coding_results (user_id);
CREATE INDEX idx_coding_results_question_id ON coding_results (question_id);
CREATE INDEX idx_coding_results_test_session_id ON coding_results (test_session_id);

-- Coding test summary table
CREATE TABLE IF NOT EXISTS coding_test_summary (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL,
    test_session_id VARCHAR(100) NOT NULL UNIQUE,
    total_questions INT NOT NULL,
    questions_attempted INT NOT NULL,
    total_score DECIMAL(5,2) DEFAULT 0,
    total_time_taken_seconds INT NOT NULL,
    average_score_percent DECIMAL(5,2) DEFAULT 0,
    overall_admin_rating DECIMAL(5,2) DEFAULT NULL,
    status VARCHAR(50) DEFAULT 'PENDING_REVIEW' CHECK (status IN ('PENDING_REVIEW', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'QUALIFIED', 'NOT_QUALIFIED')),
    qualification_email_sent BOOLEAN DEFAULT FALSE,
    qualification_email_sent_at TIMESTAMP NULL,
    qualified_for_project_round BOOLEAN DEFAULT FALSE,
    project_round_invitation_sent_at TIMESTAMP NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_coding_test_summary_user_id ON coding_test_summary (user_id);
CREATE INDEX idx_coding_test_summary_status ON coding_test_summary (status);

-- Admin review log table
CREATE TABLE IF NOT EXISTS admin_review_log (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    admin_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    test_session_id VARCHAR(100) NOT NULL,
    action_type VARCHAR(50) NOT NULL CHECK (action_type IN ('REVIEW_STARTED', 'RATING_ASSIGNED', 'FEEDBACK_ADDED', 'STATUS_CHANGED', 'EMAIL_SENT')),
    action_details TEXT,
    previous_status VARCHAR(50) NULL,
    new_status VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email templates table
CREATE TABLE IF NOT EXISTS email_templates (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    template_name VARCHAR(100) NOT NULL UNIQUE,
    subject VARCHAR(255) NOT NULL,
    html_content TEXT NOT NULL,
    text_content TEXT,
    variables JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email queue table
CREATE TABLE IF NOT EXISTS email_queue (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    to_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    html_content TEXT NOT NULL,
    text_content TEXT,
    template_variables JSONB,
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SENT', 'FAILED', 'CANCELLED')),
    attempts INT DEFAULT 0,
    max_attempts INT DEFAULT 3,
    sent_at TIMESTAMP NULL,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Project round candidates table
CREATE TABLE IF NOT EXISTS project_round_candidates (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL,
    coding_test_session_id VARCHAR(100) NOT NULL,
    invitation_sent BOOLEAN DEFAULT FALSE,
    invitation_sent_at TIMESTAMP NULL,
    invitation_accepted BOOLEAN DEFAULT NULL,
    invitation_accepted_at TIMESTAMP NULL,
    project_assigned BOOLEAN DEFAULT FALSE,
    project_assigned_at TIMESTAMP NULL,
    project_details TEXT,
    status VARCHAR(50) DEFAULT 'INVITED' CHECK (status IN ('INVITED', 'ACCEPTED', 'DECLINED', 'ASSIGNED', 'COMPLETED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add comments for documentation
COMMENT ON TABLE coding_results IS 'Stores individual coding question answers with admin reviews and ratings';
COMMENT ON TABLE coding_test_summary IS 'Overall coding test summary with qualification status';
COMMENT ON TABLE admin_review_log IS 'Tracks all admin actions for audit trail';
COMMENT ON TABLE email_templates IS 'Email templates for automated communications';
COMMENT ON TABLE email_queue IS 'Queue for sending emails to candidates';
COMMENT ON TABLE project_round_candidates IS 'Manages candidates who qualified for project round';
