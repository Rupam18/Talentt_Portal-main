package com.codeverge.talentportal.service;

import java.util.List;
import java.util.Optional;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.codeverge.talentportal.entity.CandidateResult;
import com.codeverge.talentportal.repository.CandidateResultRepository;

@Service
public class CandidateResultService {
    
    @Autowired
    private CandidateResultRepository candidateResultRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void ensureMultipleResultsPerEmailAllowed() {
        try {
            List<String> uniqueIndexes = jdbcTemplate.queryForList(
                    """
                    SELECT indexname as INDEX_NAME
                    FROM pg_indexes
                    WHERE schemaname = 'public'
                      AND tablename = 'candidate_results'
                      AND indexname LIKE '%email%'
                    """,
                    String.class
            );

            for (String indexName : uniqueIndexes) {
                jdbcTemplate.execute("DROP INDEX IF EXISTS " + indexName);
            }
        } catch (Exception ignored) {
            // Continue startup even if schema check is unavailable.
        }
    }
    
    public CandidateResult saveCandidateResult(CandidateResult result) {
        if (result.getTestDate() == null) {
            result.setTestDate(java.time.LocalDateTime.now());
        }
        if (result.getCreatedAt() == null) {
            result.setCreatedAt(java.time.LocalDateTime.now());
        }
        return candidateResultRepository.save(result);
    }
    
    public Optional<CandidateResult> getCandidateResultByEmail(String email) {
        return candidateResultRepository.findFirstByEmailOrderByTestDateDesc(email);
    }
    
    public List<CandidateResult> getAllCandidateResultsByEmail(String email) {
        return candidateResultRepository.findByEmailOrderByTestDateDesc(email);
    }
    
    public List<CandidateResult> getAllResults() {
        return candidateResultRepository.findAll();
    }

    public boolean deleteCandidateResultById(Long id) {
        if (id == null) {
            return false;
        }
        if (!candidateResultRepository.existsById(id)) {
            return false;
        }
        candidateResultRepository.deleteById(id);
        return true;
    }
    
    public CandidateResult createCandidateResult(String email, String studentName, 
                                           Integer numericalScore, Integer reasoningScore, 
                                           Integer verbalScore, Integer totalMarks, 
                                           String finalResult, Integer timeTakenMinutes, 
                                           Integer timeTakenSeconds) {
        CandidateResult result = new CandidateResult(email, studentName, numericalScore, 
                                               reasoningScore, verbalScore, totalMarks, 
                                               finalResult, timeTakenMinutes, timeTakenSeconds);
        return saveCandidateResult(result);
    }
}
