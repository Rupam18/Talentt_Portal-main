package com.codeverge.talentportal.repository;

import com.codeverge.talentportal.entity.VerbalQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VerbalQuestionRepository extends JpaRepository<VerbalQuestion, Long> {
    List<VerbalQuestion> findAllByOrderByIdAsc();
}
