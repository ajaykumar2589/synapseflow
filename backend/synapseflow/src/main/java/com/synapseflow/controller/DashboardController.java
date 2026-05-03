package com.synapseflow.controller;

import com.synapseflow.dto.DashboardResponse;
import com.synapseflow.entity.User;
import com.synapseflow.repository.UserRepository;
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

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard(Authentication authentication) {
        // Securely identify the user from their token
        String userEmail = authentication.getName();
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get the stats and return them!
        DashboardResponse stats = dashboardService.getUserDashboardStats(currentUser.getId());
        return ResponseEntity.ok(stats);
    }
}