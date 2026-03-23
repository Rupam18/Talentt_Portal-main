package com.codeverge.talentportal.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "coding_test_cases")
public class CodingTestCase {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    @JsonIgnore
    private CodingQuestion question;
    
    @Column(name = "input", columnDefinition = "TEXT")
    private String input;
    
    @Column(name = "expected_output", columnDefinition = "TEXT", nullable = false)
    private String expectedOutput;
    
    @Column(name = "is_sample", nullable = false)
    private Boolean isSample = false;
    
    @Column(name = "is_hidden", nullable = false)
    private Boolean isHidden = true;
    
    public CodingTestCase() {}
    
    public CodingTestCase(CodingQuestion question, String input, String expectedOutput, Boolean isSample) {
        this.question = question;
        this.input = input;
        this.expectedOutput = expectedOutput;
        this.isSample = isSample;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public CodingQuestion getQuestion() { return question; }
    public void setQuestion(CodingQuestion question) { this.question = question; }
    
    public String getInput() { return input; }
    public void setInput(String input) { this.input = input; }
    
    public String getExpectedOutput() { return expectedOutput; }
    public void setExpectedOutput(String expectedOutput) { this.expectedOutput = expectedOutput; }
    
    public Boolean getIsSample() { return isSample; }
    public void setIsSample(Boolean isSample) { this.isSample = isSample; }
    
    public Boolean getIsHidden() { return isHidden; }
    public void setIsHidden(Boolean isHidden) { this.isHidden = isHidden; }
}
