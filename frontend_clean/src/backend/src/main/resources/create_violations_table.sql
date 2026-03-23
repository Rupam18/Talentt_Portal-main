-- Create violations table for proctoring
CREATE TABLE IF NOT EXISTS violations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    candidate_id VARCHAR(255) NOT NULL,
    test_id VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    timestamp DATETIME NOT NULL,
    suspicion_score INT NOT NULL,
    INDEX idx_candidate_id (candidate_id),
    INDEX idx_candidate_test (candidate_id, test_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
