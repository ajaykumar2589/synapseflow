package com.synapseflow.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomePageController {

    @GetMapping("/")
    public String home() {
        return "Welcome to SynapseFlow 🚀";
    }

    @GetMapping("/payment")
    public String processPayment() {
        return "Payment processed successfully!";
    }
}