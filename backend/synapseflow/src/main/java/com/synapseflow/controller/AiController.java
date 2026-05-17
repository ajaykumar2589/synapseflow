package com.synapseflow.controller;

import com.synapseflow.dto.DashboardResponse;
import com.synapseflow.entity.Task;
import com.synapseflow.enums.TaskStatus;
import com.synapseflow.service.AIService;
import com.synapseflow.service.TaskService;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
public class AiController {

    private final ChatClient chatClient;
    private final AIService aiService;
    private final TaskService taskService;

    // Spring injects all your required services here
    public AiController(ChatClient.Builder chatClientBuilder, AIService aiService, TaskService taskService) {
        this.chatClient = chatClientBuilder.build();
        this.aiService = aiService;
        this.taskService = taskService;
    }

    // 1. YOUR ORIGINAL POSTMAN TEST ENDPOINT
    @PostMapping("/ask")
    public ResponseEntity<Map<String, String>> askAi(@RequestBody Map<String, String> request) {
        String userPrompt = request.get("prompt");

        if (userPrompt == null || userPrompt.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Prompt cannot be empty"));
        }

        String aiResponse = chatClient.prompt()
                .user(userPrompt)
                .call()
                .content();

        return ResponseEntity.ok(Map.of("prompt", userPrompt, "response", aiResponse));
    }

    // 2. THE NEW DASHBOARD ENDPOINT FOR REACT
    @GetMapping("/summary")
    public ResponseEntity<Map<String, String>> getDashboardSummary(Principal principal) {
        // Step A: Securely grab the user's tasks
        List<Task> tasks = taskService.getMyTasks(principal.getName());

        // Step B: Calculate the stats for your AIService
        int total = tasks.size();
        int completed = (int) tasks.stream().filter(t -> t.getStatus() == TaskStatus.COMPLETED).count();
        int inProgress = (int) tasks.stream().filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS).count();
        int todo = (int) tasks.stream().filter(t -> t.getStatus() == TaskStatus.TODO).count();
 DashboardResponse stats = DashboardResponse.builder()
                .totalTasks(total)
                .completedTasks(completed)
                .inProgressTasks(inProgress)
                .todoTasks(todo)
                .build();

        // Step C: Call your beautiful Spring AI service!
        String aiInsight = aiService.getDailyCoachSummary(principal.getName(), stats);

        // Step D: Send it to React
        return ResponseEntity.ok(Map.of("summary", aiInsight));
    }
}