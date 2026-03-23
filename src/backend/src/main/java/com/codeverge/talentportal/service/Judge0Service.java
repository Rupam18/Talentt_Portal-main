package com.codeverge.talentportal.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;
import java.util.Base64;

@Service
public class Judge0Service {

    @Value("${judge0.api.key:YOUR_JUDGE0_API_KEY}")
    private String apiKey;

    private static final String JUDGE0_URL = "https://judge0-ce.p.rapidapi.com/submissions";
    private static final String RAPIDAPI_HOST = "judge0-ce.p.rapidapi.com";

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> executeCode(String sourceCode, int languageId, String stdin) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-RapidAPI-Key", apiKey);
            headers.set("X-RapidAPI-Host", RAPIDAPI_HOST);

            Map<String, Object> body = new HashMap<>();
            body.put("source_code", Base64.getEncoder().encodeToString(sourceCode.getBytes()));
            body.put("language_id", languageId);
            if (stdin != null && !stdin.isEmpty()) {
                body.put("stdin", Base64.getEncoder().encodeToString(stdin.getBytes()));
            }
            body.put("base64_encoded", true);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<Map<String, Object>> response = (ResponseEntity<Map<String, Object>>) (Object) restTemplate.postForEntity(JUDGE0_URL + "?wait=true", request, Map.class);

            if (response.getStatusCode() == HttpStatus.CREATED || response.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> result = response.getBody();
                return decodeResult(result);
            }
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            Map<String, String> status = new HashMap<>();
            status.put("description", "Execution Error");
            error.put("status", status);
            error.put("stderr", e.getMessage());
            return error;
        }
        return null;
    }

    private Map<String, Object> decodeResult(Map<String, Object> result) {
        if (result == null) return null;
        
        if (result.get("stdout") != null) {
            result.put("stdout", new String(Base64.getDecoder().decode(result.get("stdout").toString())));
        }
        if (result.get("stderr") != null) {
            result.put("stderr", new String(Base64.getDecoder().decode(result.get("stderr").toString())));
        }
        if (result.get("compile_output") != null) {
            result.put("compile_output", new String(Base64.getDecoder().decode(result.get("compile_output").toString())));
        }
        if (result.get("message") != null) {
            result.put("message", new String(Base64.getDecoder().decode(result.get("message").toString())));
        }
        
        return result;
    }
}
