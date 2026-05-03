package com.synapseflow.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/portfolio")
public class PortfolioController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> getPortfolioData() {
        return ResponseEntity.ok(Map.of(
            "developer", "Ajay Chidirala",
            "currentRole", "System Engineer @ TCS",
            "education", "Computer Science (Graduated July 2023)",
            "coreSkills", List.of(
                    "Java", 
                    "Spring Boot", 
                    "Microservices", 
                    "SQL", 
                    "Spring Security", 
                    "Docker",
                    "AWS"
            ),
            "mission", "Building scalable, secure backend architectures and integrating intelligent systems.",
            "contact", Map.of(
                    "linkedin", "https://www.linkedin.com/in/chidirala-ajay-251b78222/",
                    "github", "https://github.com/ajaykumar2589/synapseflow"
            )
        ));
    }
}