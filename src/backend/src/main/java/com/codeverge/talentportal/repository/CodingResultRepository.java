package com.codeverge.talentportal.repository;

import com.codeverge.talentportal.entity.CodingResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CodingResultRepository extends JpaRepository<CodingResult, Long> {
    List<CodingResult> findByUserId(Long userId);
    List<CodingResult> findByTestSessionId(String testSessionId);
}
