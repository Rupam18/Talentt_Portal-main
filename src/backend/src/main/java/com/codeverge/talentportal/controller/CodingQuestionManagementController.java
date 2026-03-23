package com.codeverge.talentportal.controller;

import com.codeverge.talentportal.entity.CodingQuestion;
import com.codeverge.talentportal.entity.CodingTestCase;
import com.codeverge.talentportal.repository.CodingQuestionRepository;
import com.codeverge.talentportal.repository.CodingTestCaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/admin/coding-questions")
@CrossOrigin(origins = "*")
public class CodingQuestionManagementController {

    @Autowired
    private CodingQuestionRepository codingQuestionRepository;

    @Autowired
    private CodingTestCaseRepository codingTestCaseRepository;

    @GetMapping("/all")
    public ResponseEntity<List<CodingQuestion>> getAllQuestions() {
        return ResponseEntity.ok(codingQuestionRepository.findAll());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(Map.of(
            "totalQuestions", codingQuestionRepository.countByIsActive(true),
            "easyQuestions", codingQuestionRepository.countByDifficultyLevelAndIsActive(CodingQuestion.DifficultyLevel.EASY, true),
            "mediumQuestions", codingQuestionRepository.countByDifficultyLevelAndIsActive(CodingQuestion.DifficultyLevel.MEDIUM, true),
            "hardQuestions", codingQuestionRepository.countByDifficultyLevelAndIsActive(CodingQuestion.DifficultyLevel.HARD, true)
        ));
    }

    @PostMapping("/create")
    public ResponseEntity<CodingQuestion> createQuestion(@RequestBody Map<String, Object> payload) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            CodingQuestion question = mapper.convertValue(payload, CodingQuestion.class);
            question.setCreatedAt(LocalDateTime.now());
            question.setUpdatedAt(LocalDateTime.now());
            question.setIsActive(true);
            
            CodingQuestion savedQuestion = codingQuestionRepository.save(question);
            
            // Handle Test Cases if provided in JSON
            if (payload.containsKey("testCases")) {
                String testCasesJson = payload.get("testCases").toString();
                List<Map<String, String>> testCasesList = mapper.readValue(testCasesJson, new TypeReference<List<Map<String, String>>>() {});
                for (Map<String, String> tcMap : testCasesList) {
                    CodingTestCase tc = new CodingTestCase(
                        savedQuestion, 
                        tcMap.get("input"), 
                        tcMap.get("output"), 
                        false
                    );
                    codingTestCaseRepository.save(tc);
                }
            }
            
            return ResponseEntity.ok(savedQuestion);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<CodingQuestion> updateQuestion(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        return codingQuestionRepository.findById(id).map(question -> {
            try {
                ObjectMapper mapper = new ObjectMapper();
                // Update fields manually to avoid overwriting ID/CreatedAt
                if (payload.containsKey("title")) question.setTitle(payload.get("title").toString());
                if (payload.containsKey("questionText")) question.setQuestionText(payload.get("questionText").toString());
                if (payload.containsKey("difficultyLevel")) question.setDifficultyLevel(CodingQuestion.DifficultyLevel.valueOf(payload.get("difficultyLevel").toString()));
                if (payload.containsKey("programmingLanguage")) question.setProgrammingLanguage(CodingQuestion.ProgrammingLanguage.valueOf(payload.get("programmingLanguage").toString()));
                if (payload.containsKey("sampleInput")) question.setSampleInput(payload.get("sampleInput").toString());
                if (payload.containsKey("expectedOutput")) question.setExpectedOutput(payload.get("expectedOutput").toString());
                if (payload.containsKey("constraints")) question.setConstraints(payload.get("constraints").toString());
                if (payload.containsKey("hints")) question.setHints(payload.get("hints").toString());
                
                question.setUpdatedAt(LocalDateTime.now());
                CodingQuestion savedQuestion = codingQuestionRepository.save(question);
                
                // Refresh Test Cases
                if (payload.containsKey("testCases")) {
                    List<CodingTestCase> existing = codingTestCaseRepository.findByQuestionId(id);
                    codingTestCaseRepository.deleteAll(existing);
                    
                    String testCasesJson = payload.get("testCases").toString();
                    List<Map<String, String>> testCasesList = mapper.readValue(testCasesJson, new TypeReference<List<Map<String, String>>>() {});
                    for (Map<String, String> tcMap : testCasesList) {
                        CodingTestCase tc = new CodingTestCase(
                            savedQuestion, 
                            tcMap.get("input"), 
                            tcMap.get("output"), 
                            false
                        );
                        codingTestCaseRepository.save(tc);
                    }
                }
                
                return ResponseEntity.ok(savedQuestion);
            } catch (Exception e) {
                return ResponseEntity.badRequest().<CodingQuestion>build();
            }
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        List<CodingTestCase> testCases = codingTestCaseRepository.findByQuestionId(id);
        codingTestCaseRepository.deleteAll(testCases);
        codingQuestionRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
