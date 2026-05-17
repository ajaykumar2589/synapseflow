package com.synapseflow.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/contact")
public class ContactController {

    @PostMapping
    public ResponseEntity<Map<String, String>> receiveMessage(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        String email = payload.get("email");
        String message = payload.get("message");

        // For now,  we will just log it to the Spring Boot console.
        // Later, you can easily wire this up to AWS SES or JavaMailSender to actually email yourself!
        System.out.println("====== NEW PORTFOLIO MESSAGE ======");
        System.out.println("From: " + name + " (" + email + ")");
        System.out.println("Message: " + message);
        System.out.println("===================================");

        return ResponseEntity.ok(Map.of("status", "Message received successfully!"));
    }
}