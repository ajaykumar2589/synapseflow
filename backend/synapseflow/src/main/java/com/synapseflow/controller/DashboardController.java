package com.synapseflow.controller;

import com.synapseflow.dto.DashboardResponse;
import com.synapseflow.entity.User;
import com.synapseflow.repository.UserRepository;
import com.synapseflow.service.AIService;
import com.synapseflow.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final UserRepository userRepository;
    private final AIService aiService;

    @GetMapping
public ResponseEntity<DashboardResponse> getDashboard(Authentication authentication) {
    String userEmail = authentication.getName();
    User currentUser = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));

    // 1. Get the raw stats
    DashboardResponse stats = dashboardService.getUserDashboardStats(currentUser.getId());

    // 2. Get the AI summary using the new AIService
    String coachMessage = aiService.getDailyCoachSummary(currentUser.getUsername(), stats);
    stats.setAiSummary(coachMessage);

    return ResponseEntity.ok(stats);
}
}