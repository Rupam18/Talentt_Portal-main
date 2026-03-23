package com.codeverge.talentportal.repository;

import com.codeverge.talentportal.entity.Violation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ViolationRepository extends JpaRepository<Violation, Long> {
    List<Violation> findByCandidateId(String candidateId);
    List<Violation> findByCandidateIdAndTestId(String candidateId, String testId);
}
