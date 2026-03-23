package com.codeverge.talentportal.service;

import com.codeverge.talentportal.entity.Violation;
import com.codeverge.talentportal.repository.ViolationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ViolationService {

    @Autowired
    private ViolationRepository violationRepository;

    public Violation saveViolation(Violation violation) {
        return violationRepository.save(violation);
    }

    public List<Violation> getViolationsByCandidate(String candidateId) {
        return violationRepository.findByCandidateId(candidateId);
    }

    public List<Violation> getViolationsByCandidateAndTest(String candidateId, String testId) {
        return violationRepository.findByCandidateIdAndTestId(candidateId, testId);
    }
}
