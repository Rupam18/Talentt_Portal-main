package com.codeverge.talentportal.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "coding_results")
public class CodingResult {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id")
    private Long userId;
    
    @Column(name = "candidate")
    private String candidate;
    
    @Column(name = "question_id")
    private Long questionId;
    
    @Column(name = "question_text", columnDefinition = "TEXT")
    private String questionText;
    
    @Column(name = "user_code", columnDefinition = "TEXT")
    private String userCode;
    
    @Column(name = "language")
    private String language;
    
    @Column(name = "time_taken_seconds")
    private Integer timeTakenSeconds;
    
    @Column(name = "submitted_at")
    private String submittedAt;
    
    @Column(name = "test_session_id")
    private String testSessionId;
    
    @Column(name = "is_correct")
    private Boolean isCorrect;
    
    @Column(name = "score")
    private Double score;
    
    @Column(name = "feedback", columnDefinition = "TEXT")
    private String feedback;
    
    @Column(name = "admin_feedback", columnDefinition = "TEXT")
    private String adminFeedback;
    
    @Column(name = "admin_rating")
    private Integer adminRating;
    
    @Column(name = "admin_reviewed_at")
    private LocalDateTime adminReviewedAt;
    
    @Column(name = "admin_reviewer_id")
    private Long adminReviewerId;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Default constructor
    public CodingResult() {}
    
    // Constructor with required fields
    public CodingResult(Long userId, String candidate, Long questionId, String questionText, String userCode, 
                       String language, Integer timeTakenSeconds, String submittedAt, String testSessionId) {
        this.userId = userId;
        this.candidate = candidate;
        this.questionId = questionId;
        this.questionText = questionText;
        this.userCode = userCode;
        this.language = language;
        this.timeTakenSeconds = timeTakenSeconds;
        this.submittedAt = submittedAt;
        this.testSessionId = testSessionId;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getCandidate() {
        return candidate;
    }
    
    public void setCandidate(String candidate) {
        this.candidate = candidate;
    }
    
    public Long getQuestionId() {
        return questionId;
    }
    
    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }
    
    public String getQuestionText() {
        return questionText;
    }
    
    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }
    
    public String getUserCode() {
        return userCode;
    }
    
    public void setUserCode(String userCode) {
        this.userCode = userCode;
    }
    
    public String getLanguage() {
        return language;
    }
    
    public void setLanguage(String language) {
        this.language = language;
    }
    
    public Integer getTimeTakenSeconds() {
        return timeTakenSeconds;
    }
    
    public void setTimeTakenSeconds(Integer timeTakenSeconds) {
        this.timeTakenSeconds = timeTakenSeconds;
    }
    
    public String getSubmittedAt() {
        return submittedAt;
    }
    
    public void setSubmittedAt(String submittedAt) {
        this.submittedAt = submittedAt;
    }
    
    public String getTestSessionId() {
        return testSessionId;
    }
    
    public void setTestSessionId(String testSessionId) {
        this.testSessionId = testSessionId;
    }
    
    public Boolean getIsCorrect() {
        return isCorrect;
    }
    
    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }
    
    public Double getScore() {
        return score;
    }
    
    public void setScore(Double score) {
        this.score = score;
    }
    
    public String getFeedback() {
        return feedback;
    }
    
    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }
    
    public String getAdminFeedback() {
        return adminFeedback;
    }
    
    public void setAdminFeedback(String adminFeedback) {
        this.adminFeedback = adminFeedback;
    }
    
    public Integer getAdminRating() {
        return adminRating;
    }
    
    public void setAdminRating(Integer adminRating) {
        this.adminRating = adminRating;
    }
    
    public LocalDateTime getAdminReviewedAt() {
        return adminReviewedAt;
    }
    
    public void setAdminReviewedAt(LocalDateTime adminReviewedAt) {
        this.adminReviewedAt = adminReviewedAt;
    }
    
    public Long getAdminReviewerId() {
        return adminReviewerId;
    }
    
    public void setAdminReviewerId(Long adminReviewerId) {
        this.adminReviewerId = adminReviewerId;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    @Override
    public String toString() {
        return "CodingResult{" +
                "id=" + id +
                ", userId=" + userId +
                ", candidate='" + candidate + '\'' +
                ", questionId=" + questionId +
                ", language='" + language + '\'' +
                ", timeTakenSeconds=" + timeTakenSeconds +
                ", testSessionId='" + testSessionId + '\'' +
                ", submittedAt='" + submittedAt + '\'' +
                '}';
    }
}
