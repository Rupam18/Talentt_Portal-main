package com.codeverge.talentportal.controller;

import com.codeverge.talentportal.entity.Violation;
import com.codeverge.talentportal.service.ViolationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/violations")
@CrossOrigin(origins = "*")
public class ViolationController {

    @Autowired
    private ViolationService violationService;

    @PostMapping
    public ResponseEntity<Violation> reportViolation(@RequestBody Violation violation) {
        Violation savedViolation = violationService.saveViolation(violation);
        return ResponseEntity.ok(savedViolation);
    }

    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<List<Violation>> getCandidateViolations(@PathVariable String candidateId) {
        List<Violation> violations = violationService.getViolationsByCandidate(candidateId);
        return ResponseEntity.ok(violations);
    }

    @GetMapping("/candidate/{candidateId}/test/{testId}")
    public ResponseEntity<List<Violation>> getTestViolations(
            @PathVariable String candidateId,
            @PathVariable String testId) {
        List<Violation> violations = violationService.getViolationsByCandidateAndTest(candidateId, testId);
        return ResponseEntity.ok(violations);
    }
}
