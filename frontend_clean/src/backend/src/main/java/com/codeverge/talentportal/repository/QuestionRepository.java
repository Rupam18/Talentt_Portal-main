package com.codeverge.talentportal.repository;

import com.codeverge.talentportal.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    
    /**
     * Find questions by type (case insensitive)
     * @param type the type of questions to find
     * @return list of questions of the specified type
     */
    List<Question> findByTypeIgnoreCase(String type);

    /**
     * Find questions by type and order by created at descending
     * @param type the type of questions to find
     * @return list of questions
     */
    List<Question> findByTypeIgnoreCaseOrderByCreatedAtDesc(String type);

    /**
     * Find all questions ordered by created at descending
     * @return list of all questions
     */
    List<Question> findAllByOrderByCreatedAtDesc();

    List<Question> findByTypeIgnoreCaseAndIsActiveOrderByCreatedAtDesc(String type, Boolean isActive);

    List<Question> findByTypeIgnoreCaseAndDifficultyIgnoreCase(String type, String difficulty);

    List<Question> findByTypeIgnoreCaseAndProgrammingLanguageIgnoreCase(String type, String programmingLanguage);

    List<Question> findByTypeIgnoreCaseAndDifficultyIgnoreCaseAndProgrammingLanguageIgnoreCase(String type, String difficulty, String programmingLanguage);

    List<Question> findByQuestionContainingIgnoreCase(String query);

    /**
     * Find questions by type and category (both case-insensitive)
     * Used to fetch APTITUDE questions for a specific section (numerical/verbal/reasoning)
     */
    List<Question> findByTypeIgnoreCaseAndCategoryIgnoreCaseOrderByCreatedAtDesc(String type, String category);
}
