package com.codeverge.talentportal.controller;

import com.codeverge.talentportal.entity.CodingQuestion;
import com.codeverge.talentportal.entity.CodingTestCase;
import com.codeverge.talentportal.repository.CodingQuestionRepository;
import com.codeverge.talentportal.repository.CodingTestCaseRepository;
import com.codeverge.talentportal.service.Judge0Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/code-execution")
@CrossOrigin(origins = "*")
public class CodeExecutionController {

    @Autowired
    private Judge0Service judge0Service;

    @Autowired
    private CodingQuestionRepository codingQuestionRepository;

    @Autowired
    private CodingTestCaseRepository codingTestCaseRepository;

    @GetMapping("/random-question")
    public ResponseEntity<CodingQuestion> getRandomQuestion() {
        List<CodingQuestion> questions = codingQuestionRepository.findByIsActiveOrderByDifficultyLevelAsc(true);
        if (questions.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        int randomIndex = (int) (Math.random() * questions.size());
        return ResponseEntity.ok(questions.get(randomIndex));
    }

    @GetMapping("/coding-question")
    public ResponseEntity<CodingQuestion> getCodingQuestionAlias() {
        return getRandomQuestion();
    }

    @PostMapping("/run-code")
    public ResponseEntity<Map<String, Object>> runCode(@RequestBody Map<String, String> request) {
        String code = request.get("code");
        String language = request.get("language");
        String stdin = request.get("stdin");

        int languageId = getLanguageId(language);
        Map<String, Object> result = judge0Service.executeCode(code, languageId, stdin);
        
        // Wrap response in a consistent format if it's an error from Judge0Service
        return ResponseEntity.ok(result);
    }

    @PostMapping("/submit-code")
    public ResponseEntity<List<Map<String, Object>>> submitCode(@RequestBody Map<String, Object> request) {
        Long questionId = Long.valueOf(request.get("questionId").toString());
        String code = request.get("code").toString();
        String language = request.get("language").toString();

        List<CodingTestCase> testCases = codingTestCaseRepository.findByQuestionId(questionId);
        List<Map<String, Object>> results = new ArrayList<>();
        int languageId = getLanguageId(language);

        for (CodingTestCase testCase : testCases) {
            Map<String, Object> executionResult = judge0Service.executeCode(code, languageId, testCase.getInput());
            Map<String, Object> testResult = new HashMap<>();
            testResult.put("id", testCase.getId());
            testResult.put("isSample", testCase.getIsSample());
            
            String actualOutput = executionResult != null && executionResult.get("stdout") != null 
                ? executionResult.get("stdout").toString().trim() : "";
            String expectedOutput = testCase.getExpectedOutput().trim();

            testResult.put("passed", actualOutput.equals(expectedOutput));
            testResult.put("actualOutput", actualOutput);
            testResult.put("expectedOutput", expectedOutput);
            testResult.put("status", executionResult != null ? executionResult.get("status") : "Error");
            
            results.add(testResult);
        }

        return ResponseEntity.ok(results);
    }

    private int getLanguageId(String language) {
        switch (language.toLowerCase()) {
            case "java": return 62;
            case "python": return 71;
            case "javascript": return 63;
            case "cpp": return 54;
            default: return 63; // Default to JS
        }
    }
}
