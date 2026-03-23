package com.codeverge.talentportal.entity;

import java.time.LocalDateTime;

public class CodingResult {
    
    private Long id;
    private Long userId;
    private String candidate;
    private Long questionId;
    private String questionText;
    private String userCode;
    private String language;
    private Integer timeTakenSeconds;
    private String submittedAt;
    private String testSessionId;
    private Boolean isCorrect;
    private Double score;
    private String feedback;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
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
