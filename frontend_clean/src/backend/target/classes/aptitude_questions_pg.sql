-- Aptitude Questions Seed Data for PostgreSQL
INSERT INTO aptitude_questions (question, optiona, optionb, optionc, optiond, correct_answer, category, difficulty, created_at, updated_at) VALUES
('A sum becomes Rs. 8,100 in 2 years at 12.5% p.a. simple interest. Principal is:', 'Rs. 7,000', 'Rs. 7,200', 'Rs. 7,500', 'Rs. 7,800', 'a', 'numerical', 'medium', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Two trains of lengths 120m and 180m run opposite at 54 km/h and 36 km/h. Time to cross each other:', '10 sec', '12 sec', '14 sec', '16 sec', 'a', 'numerical', 'medium', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('If 3x - 2y = 7 and 2x + y = 8, value of x is:', '2', '3', '4', '5', 'b', 'numerical', 'medium', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('A can finish a work in 12 days, B in 18 days. Working together they finish in:', '6.8 days', '7.2 days', '7.5 days', '8 days', 'b', 'numerical', 'medium', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('If CP of 20 items = SP of 16 items, profit percent is:', '20%', '22.5%', '25%', '30%', 'c', 'numerical', 'medium', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('The average of 8 numbers is 24. If one number 32 is replaced by 48, new average is:', '25', '26', '27', '28', 'b', 'numerical', 'medium', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('A boat covers 30 km downstream in 2 hours and upstream in 3 hours. Speed of stream is:', '2.5 km/h', '3 km/h', '3.5 km/h', '4 km/h', 'a', 'numerical', 'medium', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('If sin(theta)=3/5 and theta is acute, then tan(theta)=', '3/4', '4/3', '5/4', '4/5', 'a', 'numerical', 'hard', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
