package com.codeverge.talentportal.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class AptitudeSchemaCompatibilityConfig implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        // Disabled to allow fresh PostgreSQL schema from DatabaseInitializer to take precedence
        /*
        if (!aptitudeQuestionsTableExists()) return;
        ...
        */
    }

    private boolean aptitudeQuestionsTableExists() {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'aptitude_questions'",
                Integer.class
        );
        return count != null && count > 0;
    }

    private Set<String> getColumns() {
        List<String> columns = jdbcTemplate.query(
                "SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'aptitude_questions'",
                (rs, rowNum) -> rs.getString("column_name").toLowerCase(Locale.ROOT)
        );
        return columns.stream().collect(Collectors.toSet());
    }

    private void ensureColumn(Set<String> existingColumns, String targetColumn, String type, String... sourceCandidates) {
        String target = targetColumn.toLowerCase(Locale.ROOT);
        if (existingColumns.contains(target)) return;

        jdbcTemplate.execute("ALTER TABLE aptitude_questions ADD COLUMN " + targetColumn + " " + type + " NULL");
        String source = findFirstAvailableColumn(existingColumns, sourceCandidates);
        if (source != null) {
            jdbcTemplate.execute(
                    "UPDATE aptitude_questions SET " + targetColumn + " = " + source + " " +
                            "WHERE " + targetColumn + " IS NULL"
            );
        }
        existingColumns.add(target);
    }

    private void copyIfBothExist(Set<String> existingColumns, String sourceColumn, String targetColumn) {
        if (!existingColumns.contains(sourceColumn.toLowerCase(Locale.ROOT)) ||
                !existingColumns.contains(targetColumn.toLowerCase(Locale.ROOT))) {
            return;
        }
        jdbcTemplate.execute(
                "UPDATE aptitude_questions " +
                        "SET " + targetColumn + " = " + sourceColumn + " " +
                        "WHERE (" + targetColumn + " IS NULL OR " + targetColumn + " = '') " +
                        "AND " + sourceColumn + " IS NOT NULL"
        );
    }

    private void dropColumnIfExists(Set<String> existingColumns, String column) {
        if (!existingColumns.contains(column.toLowerCase(Locale.ROOT))) return;
        jdbcTemplate.execute("ALTER TABLE aptitude_questions DROP COLUMN " + column);
        existingColumns.remove(column.toLowerCase(Locale.ROOT));
    }

    private void makeColumnNullableIfExists(Set<String> existingColumns, String column) {
        String lower = column.toLowerCase(Locale.ROOT);
        if (!existingColumns.contains(lower)) return;

        String type = jdbcTemplate.queryForObject(
                "SELECT DATA_TYPE FROM information_schema.columns " +
                        "WHERE table_schema = 'public' AND table_name = 'aptitude_questions' AND column_name = ?",
                String.class,
                column
        );

        if (type == null || type.isBlank()) return;
        jdbcTemplate.execute("ALTER TABLE aptitude_questions ALTER COLUMN " + column + " SET DATA TYPE " + type + ", ALTER COLUMN " + column + " DROP NOT NULL");
    }

    private String findFirstAvailableColumn(Set<String> existingColumns, String... candidates) {
        for (String candidate : candidates) {
            if (existingColumns.contains(candidate.toLowerCase(Locale.ROOT))) return candidate;
        }
        return null;
    }
}
