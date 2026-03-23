package com.codeverge.talentportal.service;

import com.codeverge.talentportal.entity.Question;
import com.codeverge.talentportal.repository.QuestionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class QuestionService {
    
    private static final Logger logger = LoggerFactory.getLogger(QuestionService.class);
    
    @Autowired
    private QuestionRepository questionRepository;
    
    /**
     * Get all questions from the database
     * @return list of all questions
     */
    public List<Question> getAllQuestions() {
        logger.info("Fetching all questions from database");
        return questionRepository.findAllByOrderByCreatedAtDesc();
    }
    
    /**
     * Get aptitude questions from the database
     * @return list of aptitude questions
     */
    public List<Question> getAptitudeQuestions() {
        logger.info("Fetching aptitude questions from database");
        return questionRepository.findByTypeIgnoreCaseOrderByCreatedAtDesc("APTITUDE");
    }

    /**
     * Get technical questions from the database
     * @return list of technical questions
     */
    public List<Question> getTechnicalQuestions() {
        logger.info("Fetching technical questions from database");
        return questionRepository.findByTypeIgnoreCaseOrderByCreatedAtDesc("TECHNICAL");
    }

    public List<Question> getCodingQuestions() {
        logger.info("Fetching coding questions from database");
        return questionRepository.findByTypeIgnoreCaseOrderByCreatedAtDesc("CODING");
    }

    /**
     * Get aptitude questions filtered by category (e.g. numerical, verbal, reasoning)
     * Falls back to all aptitude questions if category returns empty
     */
    public List<Question> getAptitudeQuestionsByCategory(String category) {
        logger.info("Fetching aptitude questions for category: {}", category);
        List<Question> categoryQuestions = questionRepository
                .findByTypeIgnoreCaseAndCategoryIgnoreCaseOrderByCreatedAtDesc("APTITUDE", category);
        if (categoryQuestions.isEmpty()) {
            // If no questions found by category, return all aptitude questions as fallback
            logger.warn("No aptitude questions found for category '{}', falling back to all aptitude questions", category);
            return questionRepository.findByTypeIgnoreCaseOrderByCreatedAtDesc("APTITUDE");
        }
        return categoryQuestions;
    }

    public List<Question> getActiveCodingQuestions() {
        return questionRepository.findByTypeIgnoreCaseAndIsActiveOrderByCreatedAtDesc("CODING", true);
    }

    public Question createQuestion(Question question) {
        question.setCreatedAt(LocalDateTime.now());
        question.setUpdatedAt(LocalDateTime.now());
        return questionRepository.save(question);
    }

    public java.util.Optional<Question> getQuestionById(Long id) {
        return questionRepository.findById(id);
    }

    public Question updateQuestion(Long id, Question questionDetails) {
        return questionRepository.findById(id).map(question -> {
            question.setQuestion(questionDetails.getQuestion());
            question.setOptionA(questionDetails.getOptionA());
            question.setOptionB(questionDetails.getOptionB());
            question.setOptionC(questionDetails.getOptionC());
            question.setOptionD(questionDetails.getOptionD());
            question.setCorrectAnswer(questionDetails.getCorrectAnswer());
            question.setCategory(questionDetails.getCategory());
            question.setDifficulty(questionDetails.getDifficulty());
            question.setType(questionDetails.getType());
            
            // Coding fields
            question.setProgrammingLanguage(questionDetails.getProgrammingLanguage());
            question.setTimeLimitMinutes(questionDetails.getTimeLimitMinutes());
            question.setSampleInput(questionDetails.getSampleInput());
            question.setExpectedOutput(questionDetails.getExpectedOutput());
            question.setConstraints(questionDetails.getConstraints());
            question.setHints(questionDetails.getHints());
            question.setSolutionCode(questionDetails.getSolutionCode());
            question.setTestCases(questionDetails.getTestCases());
            question.setPoints(questionDetails.getPoints());
            question.setIsActive(questionDetails.getIsActive());
            
            question.setUpdatedAt(LocalDateTime.now());
            return questionRepository.save(question);
        }).orElse(null);
    }

    public List<Question> getCodingQuestionsByDifficulty(String difficulty) {
        return questionRepository.findByTypeIgnoreCaseAndDifficultyIgnoreCase("CODING", difficulty);
    }

    public List<Question> getCodingQuestionsByLanguage(String language) {
        return questionRepository.findByTypeIgnoreCaseAndProgrammingLanguageIgnoreCase("CODING", language);
    }

    public List<Question> filterCodingQuestions(String difficulty, String language) {
        if (difficulty != null && language != null) {
            return questionRepository.findByTypeIgnoreCaseAndDifficultyIgnoreCaseAndProgrammingLanguageIgnoreCase("CODING", difficulty, language);
        } else if (difficulty != null) {
            return getCodingQuestionsByDifficulty(difficulty);
        } else if (language != null) {
            return getCodingQuestionsByLanguage(language);
        }
        return getCodingQuestions();
    }

    public List<Question> searchQuestions(String query) {
        return questionRepository.findByQuestionContainingIgnoreCase(query);
    }

    public boolean deleteQuestion(Long id) {
        if (questionRepository.existsById(id)) {
            questionRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
