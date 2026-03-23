-- Create questions table for Neon PostgreSQL
CREATE TABLE IF NOT EXISTS questions (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    question TEXT NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    correct_answer VARCHAR(10) NOT NULL,
    category VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample aptitude questions
INSERT INTO questions (type, question, option_a, option_b, option_c, option_d, correct_answer, category, difficulty) VALUES
('aptitude', 'If a train travels 120 km in 2 hours, what is its average speed?', '40 km/h', '60 km/h', '80 km/h', '120 km/h', 'B', 'numerical', 'easy'),
('aptitude', 'What is the next number in the sequence: 2, 4, 8, 16, ?', '24', '32', '28', '20', 'B', 'numerical', 'medium'),
('aptitude', 'A shopkeeper sells an item for $240 making a profit of 20%. What was the cost price?', '$180', '$200', '$220', '$192', 'B', 'numerical', 'medium'),
('aptitude', 'If 3 workers can complete a task in 12 days, how many days will 4 workers take?', '8 days', '9 days', '10 days', '11 days', 'B', 'numerical', 'easy'),
('aptitude', 'What is 15% of 200?', '25', '30', '35', '40', 'B', 'numerical', 'easy');

-- Insert sample technical questions
INSERT INTO questions (type, question, option_a, option_b, option_c, option_d, correct_answer, category, difficulty) VALUES
('technical', 'Which data structure follows LIFO principle?', 'Queue', 'Stack', 'Array', 'Linked List', 'B', 'dsa', 'easy'),
('technical', 'What is the time complexity of binary search?', 'O(n)', 'O(log n)', 'O(n^2)', 'O(1)', 'B', 'dsa', 'medium'),
('technical', 'Which keyword is used to prevent inheritance in Java?', 'final', 'static', 'abstract', 'private', 'A', 'java', 'medium'),
('technical', 'What does SQL stand for?', 'Structured Query Language', 'Simple Query Language', 'Standard Query Language', 'System Query Language', 'A', 'sql', 'easy'),
('technical', 'Which protocol is used for secure web browsing?', 'HTTP', 'HTTPS', 'FTP', 'SMTP', 'B', 'networking', 'easy');
