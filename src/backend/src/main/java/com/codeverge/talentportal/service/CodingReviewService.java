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

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class CodingReviewService {
    
    @Autowired
    private CodingResultRepository codingResultRepository;
    
    @Autowired
    private CodingTestSummaryRepository codingTestSummaryRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    // Get all pending coding test submissions for admin review
    public List<Map<String, Object>> getPendingSubmissions() {
        return getAllSubmissions("PENDING_REVIEW", null);
    }
    
    // Get all coding test submissions (with filters)
    public List<Map<String, Object>> getAllSubmissions(String status, String dateRange) {
        List<CodingTestSummary> summaries;
        if (status != null && !status.isEmpty()) {
            summaries = codingTestSummaryRepository.findByStatus(status);
        } else {
            summaries = codingTestSummaryRepository.findAll();
        }
        
        return summaries.stream().map(this::mapSummaryToMap).collect(Collectors.toList());
    }
    
    private Map<String, Object> mapSummaryToMap(CodingTestSummary summary) {
        Map<String, Object> map = new HashMap<>();
        map.put("user_id", summary.getUserId());
        map.put("test_session_id", summary.getTestSessionId());
        map.put("total_questions", summary.getTotalQuestions());
        map.put("questions_attempted", summary.getQuestionsAttempted());
        map.put("total_score", summary.getTotalScore());
        map.put("total_time_taken_seconds", summary.getTotalTimeTakenSeconds());
        map.put("overall_admin_rating", summary.getOverallAdminRating());
        map.put("status", summary.getStatus());
        map.put("qualification_email_sent", summary.getQualificationEmailSent());
        map.put("completed_at", summary.getCompletedAt());
        
        // Fetch student details
        Optional<Student> student = studentRepository.findById(summary.getUserId());
        if (student.isPresent()) {
            map.put("user_name", student.get().getFirstName() + " " + student.get().getLastName());
            map.put("user_email", student.get().getEmail());
        } else {
            map.put("user_name", "Unknown Candidate");
            map.put("user_email", "N/A");
        }
        
        return map;
    }
    
    // Get detailed coding test submission for review
    public Map<String, Object> getSubmissionDetails(String testSessionId) {
        Optional<CodingTestSummary> summaryOpt = codingTestSummaryRepository.findByTestSessionId(testSessionId);
        if (summaryOpt.isEmpty()) {
            return Collections.emptyMap();
        }
        
        CodingTestSummary summary = summaryOpt.get();
        Map<String, Object> details = mapSummaryToMap(summary);
        
        List<CodingResult> results = codingResultRepository.findByTestSessionId(testSessionId);
        List<Map<String, Object>> questionResults = results.stream().map(result -> {
            Map<String, Object> rMap = new HashMap<>();
            rMap.put("id", result.getId());
            rMap.put("question_id", result.getQuestionId());
            rMap.put("question_text", result.getQuestionText());
            rMap.put("user_code", result.getUserCode());
            rMap.put("language", result.getLanguage());
            rMap.put("time_taken_seconds", result.getTimeTakenSeconds());
            rMap.put("admin_rating", result.getAdminRating());
            rMap.put("admin_feedback", result.getAdminFeedback());
            rMap.put("admin_reviewed_at", result.getAdminReviewedAt());
            return rMap;
        }).collect(Collectors.toList());
        
        details.put("question_results", questionResults);
        return details;
    }
    
    // Update admin rating and feedback for a specific question
    public void reviewQuestion(Long resultId, Map<String, Object> reviewData) {
        Optional<CodingResult> resultOpt = codingResultRepository.findById(resultId);
        if (resultOpt.isPresent()) {
            CodingResult result = resultOpt.get();
            if (reviewData.containsKey("admin_rating")) {
                result.setAdminRating(Integer.parseInt(reviewData.get("admin_rating").toString()));
            }
            if (reviewData.containsKey("admin_feedback")) {
                result.setAdminFeedback(reviewData.get("admin_feedback").toString());
            }
            result.setAdminReviewedAt(LocalDateTime.now());
            if (reviewData.containsKey("admin_id")) {
                result.setAdminReviewerId(Long.parseLong(reviewData.get("admin_id").toString()));
            }
            codingResultRepository.save(result);
        }
    }
    
    // Update overall test status and rating
    public void updateSubmissionStatus(String testSessionId, Map<String, Object> statusData) {
        Optional<CodingTestSummary> summaryOpt = codingTestSummaryRepository.findByTestSessionId(testSessionId);
        if (summaryOpt.isPresent()) {
            CodingTestSummary summary = summaryOpt.get();
            if (statusData.containsKey("status")) {
                summary.setStatus(statusData.get("status").toString());
            }
            if (statusData.containsKey("overall_admin_rating")) {
                summary.setOverallAdminRating(Double.parseDouble(statusData.get("overall_admin_rating").toString()));
            }
            codingTestSummaryRepository.save(summary);
        }
    }
    
    // Send qualification email to candidate
    public void sendQualificationEmail(String testSessionId) {
        Optional<CodingTestSummary> summaryOpt = codingTestSummaryRepository.findByTestSessionId(testSessionId);
        if (summaryOpt.isPresent()) {
            CodingTestSummary summary = summaryOpt.get();
            // TODO: Integrate with actual EmailService
            summary.setQualificationEmailSent(true);
            summary.setQualificationEmailSentAt(LocalDateTime.now());
            codingTestSummaryRepository.save(summary);
        }
    }
    
    // Send rejection email to candidate
    public void sendRejectionEmail(String testSessionId) {
        Optional<CodingTestSummary> summaryOpt = codingTestSummaryRepository.findByTestSessionId(testSessionId);
        if (summaryOpt.isPresent()) {
            CodingTestSummary summary = summaryOpt.get();
            // TODO: Integrate with actual EmailService
            summary.setStatus("REJECTED");
            codingTestSummaryRepository.save(summary);
        }
    }
    
    // Get review statistics for admin dashboard
    public Map<String, Object> getReviewStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total_submissions", codingTestSummaryRepository.countTotalSubmissions());
        stats.put("pending_review", codingTestSummaryRepository.countPendingReview());
        stats.put("qualified", codingTestSummaryRepository.countQualified());
        stats.put("rejected", codingTestSummaryRepository.countRejected());
        stats.put("average_rating", codingTestSummaryRepository.getAverageRating());
        
        // Mock some daily stats if not tracked
        stats.put("emails_sent_today", 0); 
        return stats;
    }
    
    // Get admin review history (Simple implementation)
    public List<Map<String, Object>> getReviewHistory(String dateRange) {
        return Collections.emptyList(); // TODO: Implement review logs
    }
    
    public void bulkUpdateSubmissions(Map<String, Object> bulkData) {
        // TODO: Implement bulk updates
    }
    
    public List<Map<String, Object>> getEmailTemplates() {
        return Collections.emptyList(); // TODO: Implement if needed
    }
    
    public void updateEmailTemplate(Long templateId, Map<String, Object> templateData) {
        // TODO: Implement if needed
    }
}
