package com.synapseflow.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @PostMapping("/register")
    public String register() {
        return "User registered";
    }

    @PostMapping("/login")
    public String login() {
        return "User logged in";
    }
}