package com.codeverge.talentportal.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "coding_test_summary")
public class CodingTestSummary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "test_session_id", nullable = false, unique = true)
    private String testSessionId;

    @Column(name = "total_questions", nullable = false)
    private Integer totalQuestions;

    @Column(name = "questions_attempted", nullable = false)
    private Integer questionsAttempted;

    @Column(name = "total_score")
    private Double totalScore = 0.0;

    @Column(name = "total_time_taken_seconds", nullable = false)
    private Integer totalTimeTakenSeconds;

    @Column(name = "average_score_percent")
    private Double averageScorePercent = 0.0;

    @Column(name = "overall_admin_rating")
    private Double overallAdminRating;

    @Column(name = "status")
    private String status = "PENDING_REVIEW";

    @Column(name = "qualification_email_sent")
    private Boolean qualificationEmailSent = false;

    @Column(name = "qualification_email_sent_at")
    private LocalDateTime qualificationEmailSentAt;

    @Column(name = "qualified_for_project_round")
    private Boolean qualifiedForProjectRound = false;

    @Column(name = "project_round_invitation_sent_at")
    private LocalDateTime projectRoundInvitationSentAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (completedAt == null) {
            completedAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public CodingTestSummary() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getTestSessionId() { return testSessionId; }
    public void setTestSessionId(String testSessionId) { this.testSessionId = testSessionId; }

    public Integer getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }

    public Integer getQuestionsAttempted() { return questionsAttempted; }
    public void setQuestionsAttempted(Integer questionsAttempted) { this.questionsAttempted = questionsAttempted; }

    public Double getTotalScore() { return totalScore; }
    public void setTotalScore(Double totalScore) { this.totalScore = totalScore; }

    public Integer getTotalTimeTakenSeconds() { return totalTimeTakenSeconds; }
    public void setTotalTimeTakenSeconds(Integer totalTimeTakenSeconds) { this.totalTimeTakenSeconds = totalTimeTakenSeconds; }

    public Double getAverageScorePercent() { return averageScorePercent; }
    public void setAverageScorePercent(Double averageScorePercent) { this.averageScorePercent = averageScorePercent; }

    public Double getOverallAdminRating() { return overallAdminRating; }
    public void setOverallAdminRating(Double overallAdminRating) { this.overallAdminRating = overallAdminRating; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Boolean getQualificationEmailSent() { return qualificationEmailSent; }
    public void setQualificationEmailSent(Boolean qualificationEmailSent) { this.qualificationEmailSent = qualificationEmailSent; }

    public LocalDateTime getQualificationEmailSentAt() { return qualificationEmailSentAt; }
    public void setQualificationEmailSentAt(LocalDateTime qualificationEmailSentAt) { this.qualificationEmailSentAt = qualificationEmailSentAt; }

    public Boolean getQualifiedForProjectRound() { return qualifiedForProjectRound; }
    public void setQualifiedForProjectRound(Boolean qualifiedForProjectRound) { this.qualifiedForProjectRound = qualifiedForProjectRound; }

    public LocalDateTime getProjectRoundInvitationSentAt() { return projectRoundInvitationSentAt; }
    public void setProjectRoundInvitationSentAt(LocalDateTime projectRoundInvitationSentAt) { this.projectRoundInvitationSentAt = projectRoundInvitationSentAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
