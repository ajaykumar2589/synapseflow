package com.synapseflow.controller;
import com.synapseflow.dto.LoginRequest;
import com.synapseflow.dto.RegisterRequest;
import com.synapseflow.entity.User;
import com.synapseflow.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest request) {
        User registeredUser = userService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser);
    }
    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody LoginRequest request) {
        User loggedInUser = userService.loginUser(request);
        return ResponseEntity.ok(loggedInUser);
    }
}