package com.synapseflow.controller;

import com.synapseflow.entity.User;
import com.synapseflow.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users") // Standardized to match your other controllers
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // Securely gets the profile of the user making the request
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        // authentication.getName() automatically grabs the email from the verified JWT
        String email = authentication.getName(); 
        User currentUser = userService.getUserByEmail(email);
        return ResponseEntity.ok(currentUser);
    }
}