package com.synapseflow.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/about")
public class AboutUsController {

    @GetMapping
    public String about() {
        return "About SynapseFlow";
    }
}