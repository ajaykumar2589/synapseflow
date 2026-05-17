package com.synapseflow.service;

import com.synapseflow.dto.LoginRequest;
import com.synapseflow.dto.RegisterRequest;
import com.synapseflow.entity.User;
import com.synapseflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder; // IMPORT THIS
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // IMPORT THIS

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // 1. INJECT THE ENCODER

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
                // FIX: Encode the password during registration!
                .password(passwordEncoder.encode(request.getPassword())) 
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

    // --- NEW METHOD FOR OPTION 2 ---
    @Transactional
    public void updatePassword(String email, String currentPassword, String newPassword) {
        User user = getUserByEmail(email);

        // Verify the old password matches the database hash
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect.");
        }

        // Encode the new password and save
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}