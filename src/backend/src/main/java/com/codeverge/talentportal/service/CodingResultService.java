package com.codeverge.talentportal.service;

import com.codeverge.talentportal.entity.CodingResult;
import com.codeverge.talentportal.entity.CodingTestSummary;
import com.codeverge.talentportal.entity.Student;
import com.codeverge.talentportal.repository.CodingResultRepository;
import com.codeverge.talentportal.repository.CodingTestSummaryRepository;
import com.codeverge.talentportal.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CodingResultService {

    @Autowired
    private CodingResultRepository codingResultRepository;

    @Autowired
    private CodingTestSummaryRepository codingTestSummaryRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private EmailService emailService;

    @Transactional
    public CodingResult saveResult(CodingResult result) {
        CodingResult savedResult = codingResultRepository.save(result);
        updateSummary(result.getTestSessionId(), result.getUserId());
        return savedResult;
    }

    @Transactional
    public List<CodingResult> saveAllResults(List<CodingResult> results) {
        if (results.isEmpty()) return results;
        
        List<CodingResult> savedResults = codingResultRepository.saveAll(results);
        String sessionId = results.get(0).getTestSessionId();
        Long userId = results.get(0).getUserId();
        updateSummary(sessionId, userId);

        // Send completion email
        try {
            studentRepository.findById(userId).ifPresent(student -> {
                emailService.sendCodingCompletionEmail(student.getEmail(), 
                    student.getFirstName() + " " + student.getLastName());
            });
        } catch (Exception e) {
            // Log error but don't fail the transaction
            System.err.println("Failed to send coding completion email: " + e.getMessage());
        }

        return savedResults;
    }

    private void updateSummary(String sessionId, Long userId) {
        List<CodingResult> results = codingResultRepository.findByTestSessionId(sessionId);
        if (results.isEmpty()) return;

        Optional<CodingTestSummary> existingSummary = codingTestSummaryRepository.findByTestSessionId(sessionId);
        CodingTestSummary summary = existingSummary.orElse(new CodingTestSummary());

        summary.setTestSessionId(sessionId);
        summary.setUserId(userId);
        summary.setQuestionsAttempted(results.size());
        
        // Default total questions to at least the attempted count
        if (summary.getTotalQuestions() == null || summary.getTotalQuestions() < results.size()) {
            summary.setTotalQuestions(results.size());
        }

        int totalTime = results.stream().mapToInt(CodingResult::getTimeTakenSeconds).sum();
        summary.setTotalTimeTakenSeconds(totalTime);

        double totalScore = results.stream()
                .filter(r -> r.getScore() != null)
                .mapToDouble(CodingResult::getScore)
                .sum();
        summary.setTotalScore(totalScore);
        
        // Calculate average score if possible
        if (summary.getTotalQuestions() > 0) {
            summary.setAverageScorePercent((totalScore / (summary.getTotalQuestions() * 100.0)) * 100.0);
        }

        codingTestSummaryRepository.save(summary);
    }

    public List<CodingResult> getResultsByUserId(Long userId) {
        return codingResultRepository.findByUserId(userId);
    }

    public List<CodingResult> getResultsBySessionId(String sessionId) {
        return codingResultRepository.findByTestSessionId(sessionId);
    }
}
