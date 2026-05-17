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
            "hero", Map.of(
                "greeting", "Hello, I'm",
                "name", "Ajay Chidirala",
                "role", "B.TECH IN COMPUTER SCIENCE AND A FULL STACK DEVELOPER",
                "bio", "I have fine experience in modern web technologies including ReactJS, Java, Spring Boot, AWS, and MySQL. I love building scalable architectures and side projects."
            ),
            "experience", List.of(
                Map.of(
                    "company", "TCS",
                    "title", "System Engineer (Full Stack)",
                    "period", "Oct 2023 - Present",
                    "description", "Engineered 12+ microservices reducing latency by 15% for 5M+ daily users. Automated CI/CD pipelines reducing deployment effort by 40%."
                ),
                Map.of(
                    "company", "Experian",
                    "title", "Software Engineer Intern",
                    "period", "Sep 2022 - Feb 2023",
                    "description", "Refined backend architecture by designing layered Spring Boot REST APIs, leading to a 35% reduction in response time."
                )
            ),
            "projects", List.of(
                Map.of(
                    "title", "SynapseFlow (SaaS)",
                    "category", "Full Stack",
                    "description", "A modern task management dashboard with integrated Google Gemini AI coaching, secured by JWT and Spring Security."
                ),
                Map.of(
                    "title", "Low-Light Image Enhancement",
                    "category", "Machine Learning",
                    "description", "Designed a three-stage CNN architecture achieving 97% user satisfaction in qualitative evaluations."
                )
            ),
            "skills", Map.of(
                "2023", "Java 17, Spring Boot, Microservices, AWS (EC2/RDS)",
                "2022", "React.js, Redux, JavaScript (ES6+), MySQL",
                "Tools", "Docker, Jenkins, Git, Postman, JUnit"
            ),
            "contact", Map.of(
                "email", "ajaychidirala5@gmail.com",
                "phone", "+91 6304478856",
                "linkedin", "https://www.linkedin.com/in/chidirala-ajay-251b78222/",
                "github", "https://github.com/ajaykumar2589/synapseflow"
            )
        ));
    }
}