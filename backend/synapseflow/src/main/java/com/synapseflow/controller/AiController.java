package com.synapseflow.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
public class AiController{

    @GetMapping
    public String ai() {
        return "AI data";
    }
}