package com.codeverge.talentportal.config;

import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.Statement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.util.FileCopyUtils;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;

@Configuration
public class DataInitializationConfig {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Bean
    public CommandLineRunner initializeTechnicalTestResultsTable() {
        return args -> {
            try {
                var dataSource = jdbcTemplate.getDataSource();
                if (dataSource == null) return;
                try (Connection connection = dataSource.getConnection()) {
                    try (Statement statement = connection.createStatement()) {
                        var resultSet = statement.executeQuery(
                            "SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'technical_test_results'"
                        );
                        
                        if (!resultSet.next()) {
                            System.out.println("Creating technical_test_results table...");
                            var resource = new ClassPathResource("technical_test_results_pg.sql");
                            try (var reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)) {
                                String sql = FileCopyUtils.copyToString(reader);
                                String[] statements = sql.split(";");
                                for (String stmt : statements) {
                                    String cleaned = stmt.replaceAll("(?m)^\\s*--.*$", "").trim();
                                    if (cleaned.isEmpty()) continue;
                                    statement.execute(cleaned);
                                }
                                System.out.println("technical_test_results table created successfully!");
                            }
                        } else {
                            System.out.println("technical_test_results table already exists.");
                        }
                    }
                }
            } catch (Exception e) {
                System.err.println("Error initializing technical_test_results table: " + e.getMessage());
            }
        };
    }

    @Bean
    public CommandLineRunner initializeAdminsTable() {
        return args -> {
            try {
                var dataSource = jdbcTemplate.getDataSource();
                if (dataSource == null) return;
                try (Connection connection = dataSource.getConnection()) {
                    try (Statement statement = connection.createStatement()) {
                        var resultSet = statement.executeQuery(
                            "SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admins'"
                        );
                        
                        if (!resultSet.next()) {
                            System.out.println("Creating admins table and inserting default admin...");
                            var resource = new ClassPathResource("admin_setup_pg.sql");
                            try (var reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)) {
                                String sql = FileCopyUtils.copyToString(reader);
                                String[] statements = sql.split(";");
                                for (String stmt : statements) {
                                    String cleaned = stmt.replaceAll("(?m)^\\s*--.*$", "").trim();
                                    if (cleaned.isEmpty()) continue;
                                    statement.execute(cleaned);
                                }
                                System.out.println("Admin initialization completed successfully!");
                            }
                        } else {
                            statement.execute(
                                "INSERT INTO admins (email, password) " +
                                "SELECT 'admincodeverge@gmail.com', 'Admin@123' " +
                                "WHERE NOT EXISTS (SELECT 1 FROM admins WHERE email = 'admincodeverge@gmail.com')"
                            );
                            statement.execute(
                                "UPDATE admins SET password = 'Admin@123' WHERE email = 'admincodeverge@gmail.com' AND password LIKE '$2a$%'"
                            );
                            System.out.println("Admins table already exists (default admin verified and reset if needed).");
                        }
                    }
                }
            } catch (Exception e) {
                System.err.println("Error initializing admins table: " + e.getMessage());
            }
        };
    }

    @Bean
    public CommandLineRunner seedDatabaseQuestions() {
        return args -> {
            var dataSource = jdbcTemplate.getDataSource();
            if (dataSource == null) return;

            // Seed Unified Questions (Aptitude & Technical)
            try {
                // Drop and recreate if columns are missing (simple way to ensure schema harmony during development/unification)
                boolean hasCategory = false;
                try {
                    jdbcTemplate.execute("SELECT category FROM questions LIMIT 1");
                    hasCategory = true;
                } catch (Exception e) {
                    System.out.println("Unified questions table missing 'category' or does not exist. Correcting schema...");
                    jdbcTemplate.execute("DROP TABLE IF EXISTS questions CASCADE");
                }

                if (!hasCategory) {
                    System.out.println("Initializing unified questions from corrected script...");
                    ResourceDatabasePopulator populator = new ResourceDatabasePopulator(new ClassPathResource("questions_table.sql"));
                    populator.execute(dataSource);
                    System.out.println("Unified questions initialized with corrected schema!");
                } else {
                    Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM questions", Integer.class);
                    if (count != null && count == 0) {
                        System.out.println("Seeding empty unified questions table...");
                        ResourceDatabasePopulator populator = new ResourceDatabasePopulator(new ClassPathResource("questions_table.sql"));
                        populator.execute(dataSource);
                        System.out.println("Unified questions seeded successfully!");
                    }
                }
            } catch (Exception e) {
                System.err.println("Error seeding unified questions: " + e.getMessage());
            }

            // Fallback: Seed specific tables if legacy support is still needed (Optional, usually we'd migrate)
            try {
                jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS aptitude_questions (id BIGSERIAL PRIMARY KEY, question TEXT, optiona VARCHAR(255), optionb VARCHAR(255), optionc VARCHAR(255), optiond VARCHAR(255), correct_answer VARCHAR(10), category VARCHAR(50), difficulty VARCHAR(20), created_at TIMESTAMP, updated_at TIMESTAMP)");
                Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM aptitude_questions", Integer.class);
                if (count != null && count == 0) {
                    System.out.println("Seeding legacy aptitude_questions...");
                    ResourceDatabasePopulator populator = new ResourceDatabasePopulator(new ClassPathResource("aptitude_questions_pg.sql"));
                    populator.execute(dataSource);
                }
            } catch (Exception e) {
                System.err.println("Notice: Skipping legacy aptitude seeding: " + e.getMessage());
            }

            try {
                jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS technical_questions (id BIGSERIAL PRIMARY KEY, question TEXT, optiona VARCHAR(255), optionb VARCHAR(255), optionc VARCHAR(255), optiond VARCHAR(255), correct_answer VARCHAR(10), category VARCHAR(50), difficulty VARCHAR(20), created_at TIMESTAMP, updated_at TIMESTAMP)");
                Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM technical_questions", Integer.class);
                if (count != null && count == 0) {
                    System.out.println("Seeding legacy technical_questions...");
                    ResourceDatabasePopulator populator = new ResourceDatabasePopulator(new ClassPathResource("technical_questions_pg.sql"));
                    populator.execute(dataSource);
                }
            } catch (Exception e) {
                System.err.println("Notice: Skipping legacy technical seeding: " + e.getMessage());
            }

            // Seed Coding Questions
            try {
                Integer totalCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM coding_questions", Integer.class);
                System.out.println("Processing coding_questions | Current count: " + totalCount);
                if (totalCount != null && totalCount < 4) {
                    System.out.println("Resetting and re-seeding coding_questions...");
                    jdbcTemplate.execute("DELETE FROM coding_questions");
                    
                    String sql = "INSERT INTO coding_questions (question_text, question_type, difficulty_level, programming_language, time_limit_minutes, sample_input, expected_output, constraints, hints, solution_code, test_cases, points, is_active, created_by, created_at, updated_at) " +
                                 "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?::jsonb, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";
                    
                    Object[][] questions = {
                        {
                            "Write a function that finds the maximum subarray sum", "ALGORITHM", "MEDIUM", "JAVASCRIPT", 45, 
                            "[-2,1,-3,4,-1,2,1,-5,4]", "6", "Array length between 1 and 10^5, elements between -10^9 and 10^9", 
                            "Use Kadane's algorithm or sliding window approach", 
                            "function maxSubArray(nums) { let maxSum = -Infinity; let currentSum = 0; for (let num of nums) { currentSum = Math.max(num, currentSum + num); maxSum = Math.max(maxSum, currentSum); } return maxSum; }",
                            "[{\"input\":[-2,1,-3,4,-1,2,1,-5,4],\"output\":6},{\"input\":[1,2,3,4,5],\"output\":15}]", 20, true, "admin"
                        },
                        {
                            "Implement a binary search tree", "DATA_STRUCTURE", "HARD", "JAVA", 60, 
                            "[5,3,7,2,4,null,6,8]", "Valid BST with proper left/right child relationships", 
                            "Start with root node, handle null values, maintain tree properties", 
                            "Recursively build left/right subtrees using binary search properties", 
                            "class TreeNode { int val; TreeNode left; TreeNode right; TreeNode(int val) { this.val = val; } } class BST { TreeNode root; public TreeNode insert(int val) { root = insertRec(root, val); return root; } private TreeNode insertRec(TreeNode root, int val) { if (root == null) return new TreeNode(val); if (val < root.val) root.left = insertRec(root.left, val); else root.right = insertRec(root.right, val); return root; } }",
                            "[{\"tree\":[5,3,7,2,4,null,6,8],\"inorder\":[2,3,4,5,6,7,8],\"search\":true},{\"tree\":[1,2,3],\"inorder\":[1,2,3],\"search\":false}]", 30, true, "admin"
                        },
                        {
                            "Solve the two-sum problem", "PROBLEM_SOLVING", "EASY", "PYTHON", 30, 
                            "[2,7,11,15]", "9", "Exactly two indices that sum to target, indices must be different", "Use hash map or two-pointer technique", 
                            "def two_sum(nums, target): seen = {}; for i, num in enumerate(nums): complement = target - num; if complement in seen: return [seen[complement], i]; seen[num] = i; return []",
                            "[{\"nums\":[2,7,11,15],\"target\":9,\"output\":[0,1]},{\"nums\":[3,2,4],\"target\":6,\"output\":[1,2]}]", 15, true, "admin"
                        },
                        {
                            "Design a linked list with add/remove operations", "CODING_CHALLENGE", "MEDIUM", "CPP", 40, 
                            "Empty list initially", "O(1) for add, O(1) for remove, maintain head pointer", "class Node { public: int data; Node* next; Node(int x) : data(x), next(nullptr) {} };", 
                            "Use doubly linked list or maintain tail pointer", 
                            "class LinkedList { private: Node* head; public: LinkedList() : head(nullptr) {} void add(int data) { Node* newNode = new Node(data); if (!head) { head = newNode; return; } Node* temp = head; while (temp->next) temp = temp->next; temp->next = newNode; } }",
                            "[{\"operations\":[\"add\",5,\"remove\",3,\"add\",10,\"remove\",10],\"final\":[5,10]}]", 25, true, "admin"
                        }
                    };

                    for (Object[] question : questions) {
                        try {
                            jdbcTemplate.update(sql, question);
                        } catch (Exception e) {
                            System.err.println("Error inserting question: " + question[0]);
                            System.err.println(e.getMessage());
                        }
                    }
                    System.out.println("Coding questions seeding completed!");
                }
                
                Integer activeCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM coding_questions WHERE is_active = true", Integer.class);
                System.out.println("Final active coding_questions count: " + activeCount);
                
            } catch (Exception e) {
                System.err.println("Error during coding questions seeding: " + e.getMessage());
                e.printStackTrace();
            }
        };
    }
}
