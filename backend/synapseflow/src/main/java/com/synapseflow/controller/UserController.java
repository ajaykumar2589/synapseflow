package com.synapseflow.controller;

import com.synapseflow.entity.User;
import com.synapseflow.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        String email = authentication.getName(); 
        User currentUser = userService.getUserByEmail(email);
        
        return ResponseEntity.ok(Map.of(
            "username", currentUser.getUsername(),
            "email", currentUser.getEmail()
        ));
    }

    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> request, Authentication authentication) {
        String email = authentication.getName();
        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");

        try {
            userService.updatePassword(email, currentPassword, newPassword);
            return ResponseEntity.ok(Map.of("message", "Password updated successfully!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}