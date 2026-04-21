 package com.synapseflow.dto;

import lombok.Data;

// @ Data generates getters, setters, toString, equals, and hashCode methods automatically
@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
}