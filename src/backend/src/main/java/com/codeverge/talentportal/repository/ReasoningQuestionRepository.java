package com.codeverge.talentportal.repository;

import com.codeverge.talentportal.entity.ReasoningQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReasoningQuestionRepository extends JpaRepository<ReasoningQuestion, Long> {
    List<ReasoningQuestion> findAllByOrderByIdAsc();
}
