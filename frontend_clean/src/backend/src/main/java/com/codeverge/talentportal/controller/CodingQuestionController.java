package com.codeverge.talentportal.controller;

import com.codeverge.talentportal.entity.Question;
import com.codeverge.talentportal.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/coding-questions")
@CrossOrigin(origins = "*")
public class CodingQuestionController {
    
    @Autowired
    private QuestionService questionService;
    
    // Get all active questions
    @GetMapping("/all")
    public ResponseEntity<List<Question>> getAllQuestions() {
        List<Question> questions = questionService.getActiveCodingQuestions();
        return ResponseEntity.ok(questions);
    }
    
    // Get question by ID
    @GetMapping("/{id}")
    public ResponseEntity<Question> getQuestionById(@PathVariable Long id) {
        Optional<Question> question = questionService.getQuestionById(id);
        if (question.isPresent()) {
            return ResponseEntity.ok(question.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Create new question
    @PostMapping("/create")
    public ResponseEntity<Question> createQuestion(@RequestBody Question question) {
        try {
            question.setType("CODING");
            Question createdQuestion = questionService.createQuestion(question);
            return ResponseEntity.ok(createdQuestion);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Update question
    @PutMapping("/update/{id}")
    public ResponseEntity<Question> updateQuestion(@PathVariable Long id, @RequestBody Question questionDetails) {
        questionDetails.setType("CODING");
        Question updatedQuestion = questionService.updateQuestion(id, questionDetails);
        if (updatedQuestion != null) {
            return ResponseEntity.ok(updatedQuestion);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Delete question
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        boolean deleted = questionService.deleteQuestion(id);
        if (deleted) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Get questions by difficulty
    @GetMapping("/difficulty/{difficulty}")
    public ResponseEntity<List<Question>> getQuestionsByDifficulty(@PathVariable String difficulty) {
        List<Question> questions = questionService.getCodingQuestionsByDifficulty(difficulty);
        return ResponseEntity.ok(questions);
    }
    
    // Get questions by programming language
    @GetMapping("/language/{language}")
    public ResponseEntity<List<Question>> getQuestionsByLanguage(@PathVariable String language) {
        List<Question> questions = questionService.getCodingQuestionsByLanguage(language);
        return ResponseEntity.ok(questions);
    }
    
    // Search questions
    @GetMapping("/search")
    public ResponseEntity<List<Question>> searchQuestions(@RequestParam String q) {
        List<Question> questions = questionService.searchQuestions(q);
        return ResponseEntity.ok(questions);
    }
    
    // Filter questions with multiple criteria
    @GetMapping("/filter")
    public ResponseEntity<List<Question>> filterQuestions(
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String language) {
        
        List<Question> questions = questionService.filterCodingQuestions(difficulty, language);
        return ResponseEntity.ok(questions);
    }
    
    // Get all available options for filters (Simplified for unified Question)
    @GetMapping("/options")
    public ResponseEntity<Map<String, Object>> getFilterOptions() {
        return ResponseEntity.ok(Map.of(
            "difficulties", List.of("EASY", "MEDIUM", "HARD"),
            "languages", List.of("JAVA", "PYTHON", "JAVASCRIPT", "CPP")
        ));
    }
}
