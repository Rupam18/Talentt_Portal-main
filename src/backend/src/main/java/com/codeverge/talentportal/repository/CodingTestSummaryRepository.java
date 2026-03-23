package com.codeverge.talentportal.repository;

import com.codeverge.talentportal.entity.CodingTestSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CodingTestSummaryRepository extends JpaRepository<CodingTestSummary, Long> {
    Optional<CodingTestSummary> findByTestSessionId(String testSessionId);
    List<CodingTestSummary> findByUserId(Long userId);
    List<CodingTestSummary> findByStatus(String status);
    
    @Query("SELECT COUNT(c) FROM CodingTestSummary c")
    long countTotalSubmissions();
    
    @Query("SELECT COUNT(c) FROM CodingTestSummary c WHERE c.status = 'PENDING_REVIEW'")
    long countPendingReview();
    
    @Query("SELECT COUNT(c) FROM CodingTestSummary c WHERE c.status = 'QUALIFIED'")
    long countQualified();
    
    @Query("SELECT COUNT(c) FROM CodingTestSummary c WHERE c.status = 'REJECTED'")
    long countRejected();
    
    @Query("SELECT AVG(c.overallAdminRating) FROM CodingTestSummary c WHERE c.overallAdminRating IS NOT NULL")
    Double getAverageRating();
}
