package com.codeverge.talentportal.controller;

import com.codeverge.talentportal.entity.VerbalQuestion;
import com.codeverge.talentportal.repository.VerbalQuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/verbal-questions")
@CrossOrigin(origins = "*")
public class VerbalQuestionController {

    @Autowired
    private VerbalQuestionRepository verbalQuestionRepository;

    /**
     * GET /api/verbal-questions
     * Returns all questions from the verbal_questions table.
     */
    @GetMapping
    public ResponseEntity<?> getVerbalQuestions() {
        try {
            List<VerbalQuestion> questions = verbalQuestionRepository.findAllByOrderByIdAsc();
            return ResponseEntity.ok(Map.of(
                "message", "Verbal questions retrieved successfully",
                "questions", questions,
                "count", questions.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("message", "Failed to retrieve verbal questions: " + e.getMessage())
            );
        }
    }
}
