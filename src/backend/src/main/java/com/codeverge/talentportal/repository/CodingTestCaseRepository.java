package com.codeverge.talentportal.repository;

import com.codeverge.talentportal.entity.CodingTestCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CodingTestCaseRepository extends JpaRepository<CodingTestCase, Long> {
    List<CodingTestCase> findByQuestionId(Long questionId);
    List<CodingTestCase> findByQuestionIdAndIsSampleTrue(Long questionId);
}
