package com.codeverge.talentportal.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FrontendController {

    /**
     * Forwards all non-API, non-static-resource paths to index.html.
     * This allows React Router to handle deep-linked URLs on page refresh.
     */
    @GetMapping(value = {
        "/",
        "/{path:[^\\.]*}",
        "/test-instructions/**",
        "/compatibility-check/**",
        "/test/**",
        "/result/**",
        "/technical-test-relaxation/**",
        "/technical-test/**",
        "/technical-result/**",
        "/coding-test-relaxation/**",
        "/coding-round/**",
        "/coding-test/**",
        "/all-tests-completed/**",
        "/dashboard/**",
        "/admin/**"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
