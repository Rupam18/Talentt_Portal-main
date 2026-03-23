package com.codeverge.talentportal.controller;

import com.codeverge.talentportal.entity.ReasoningQuestion;
import com.codeverge.talentportal.repository.ReasoningQuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reasoning-questions")
@CrossOrigin(origins = "*")
public class ReasoningQuestionController {

    @Autowired
    private ReasoningQuestionRepository reasoningQuestionRepository;

    /**
     * GET /api/reasoning-questions
     * Returns all questions from the reasoning_questions table.
     */
    @GetMapping
    public ResponseEntity<?> getReasoningQuestions() {
        try {
            List<ReasoningQuestion> questions = reasoningQuestionRepository.findAllByOrderByIdAsc();
            return ResponseEntity.ok(Map.of(
                "message", "Reasoning questions retrieved successfully",
                "questions", questions,
                "count", questions.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("message", "Failed to retrieve reasoning questions: " + e.getMessage())
            );
        }
    }
}
