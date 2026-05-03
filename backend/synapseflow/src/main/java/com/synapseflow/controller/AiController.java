package com.synapseflow.controller;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
public class AiController {

    private final ChatClient chatClient;

    // Spring Boot automatically builds and injects the ChatClient for us based on the pom.xml and application.properties!
    public AiController(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    @PostMapping("/ask")
    public ResponseEntity<Map<String, String>> askAi(@RequestBody Map<String, String> request) {
        String userPrompt = request.get("prompt");

        // Safety check: Don't send empty requests to the AI
        if (userPrompt == null || userPrompt.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Prompt cannot be empty"));
        }

        // This is the magic! Send the prompt to the AI and capture the String response.
        String aiResponse = chatClient.prompt()
                .user(userPrompt)
                .call()
                .content();

        // Return a clean JSON response
        return ResponseEntity.ok(Map.of(
                "prompt", userPrompt,
                "response", aiResponse
        ));
    }
}