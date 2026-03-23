-- Sample Coding Question: Two Sum
INSERT INTO coding_questions (title, question_text, question_type, difficulty_level, programming_language, time_limit_minutes, sample_input, expected_output, constraints, hints, points, is_active, created_at, updated_at)
VALUES (
    'Two Sum',
    'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
    'ALGORITHM',
    'EASY',
    'JAVASCRIPT',
    5,
    '[2,7,11,15], 9',
    '[0,1]',
    '2 <= nums.length <= 104\n-109 <= nums[i] <= 109\n-109 <= target <= 109',
    'Try using a hash map to store the indices of seen numbers.',
    10,
    true,
    NOW(),
    NOW()
);

-- Get the ID of the inserted question (Assuming it's the first one, or use a variable in a real pg script)
-- For demonstration, I'll use a subquery if needed, but here's the test cases:
INSERT INTO coding_test_cases (question_id, input, expected_output, is_sample, is_hidden)
SELECT id, '[2,7,11,15]\n9', '[0,1]', true, false FROM coding_questions WHERE title = 'Two Sum';

INSERT INTO coding_test_cases (question_id, input, expected_output, is_sample, is_hidden)
SELECT id, '[3,2,4]\n6', '[1,2]', false, true FROM coding_questions WHERE title = 'Two Sum';

INSERT INTO coding_test_cases (question_id, input, expected_output, is_sample, is_hidden)
SELECT id, '[3,3]\n6', '[0,1]', false, true FROM coding_questions WHERE title = 'Two Sum';
