package com.synapseflow.service;

import com.synapseflow.dto.LoginRequest;
import com.synapseflow.dto.RegisterRequest;
import com.synapseflow.entity.User;
import com.synapseflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User registerUser(RegisterRequest request) {
        
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered");
        }

        User newUser = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(request.getPassword()) 
                .build();

        return userRepository.save(newUser);
    }
    

   public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }
    
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
    }
}