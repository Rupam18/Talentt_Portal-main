-- Technical Questions Seed Data for PostgreSQL
INSERT INTO technical_questions (question, optiona, optionb, optionc, optiond, correct_answer, category, difficulty, created_at, updated_at) VALUES
('Which of the following is not a primitive data type in Java?', 'int', 'boolean', 'String', 'char', 'c', 'java', 'easy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('What is the output of len([1, 2, 3]) in Python?', '2', '3', '4', 'Error', 'b', 'python', 'easy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Which operator is used for strict equality in JavaScript?', '=', '==', '===', '!=', 'c', 'javascript', 'easy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('In React, what is the purpose of useEffect?', 'To handle component state', 'To perform side effects', 'To define component styling', 'To handle routing', 'b', 'react', 'medium', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('What does HTTP stand for?', 'HyperText Transfer Protocol', 'HyperText Transmission Process', 'HighText Transfer Protocol', 'HyperText Transport Protocol', 'a', 'general', 'easy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Which command is used to list all containers in Docker?', 'docker run', 'docker ps -a', 'docker image ls', 'docker build', 'b', 'general', 'medium', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('What is the default port for PostgreSQL?', '3306', '5432', '8080', '27017', 'b', 'sql', 'easy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('In SQL, which clause is used to filter rows after grouping?', 'WHERE', 'HAVING', 'GROUP BY', 'ORDER BY', 'b', 'sql', 'medium', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
