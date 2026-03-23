package com.codeverge.talentportal.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, String> home() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("message", "Codeverge Talent Portal API is running.");
        status.put("environment", "PostgreSQL (Neon)");
        status.put("frontend_url", "http://localhost:5173");
        return status;
    }
}
