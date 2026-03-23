package com.codeverge.talentportal.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;

@Component
public class DatabaseConfig implements CommandLineRunner {
    
    private static final Logger logger = LoggerFactory.getLogger(DatabaseConfig.class);
    
    @Autowired
    private DataSource dataSource;
    
    @Override
    public void run(String... args) throws Exception {
        logDatabaseConnectionInfo();
        logQuestionCount();
    }
    
    private void logDatabaseConnectionInfo() {
        try (Connection connection = dataSource.getConnection()) {
            String dbUrl = connection.getMetaData().getURL();
            logger.info("=== Database Connection Information ===");
            logger.info("Database URL: {}", dbUrl);
            logger.info("Database Product Name: {}", connection.getMetaData().getDatabaseProductName());
            logger.info("Database Product Version: {}", connection.getMetaData().getDatabaseProductVersion());
            logger.info("Connection Valid: {}", connection.isValid(5));
            logger.info("========================================");
        } catch (Exception e) {
            logger.error("Failed to get database connection info", e);
        }
    }
    
    private void logQuestionCount() {
        try (Connection connection = dataSource.getConnection()) {
            var statement = connection.createStatement();
            var resultSet = statement.executeQuery("SELECT COUNT(*) FROM questions");
            if (resultSet.next()) {
                int count = resultSet.getInt(1);
                logger.info("Total questions in database: {}", count);
            }
        } catch (Exception e) {
            logger.warn("Could not query question count (table may not exist yet): {}", e.getMessage());
        }
    }
}
