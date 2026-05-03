package com.synapseflow.service;

import com.synapseflow.dto.AuthResponse;
import com.synapseflow.dto.LoginRequest;
import com.synapseflow.dto.RegisterRequest;
import com.synapseflow.entity.User;
import com.synapseflow.repository.UserRepository;
import com.synapseflow.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, 
                       JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        // NEVER save raw passwords! Hash them before saving to the DB:
        user.setPassword(passwordEncoder.encode(request.getPassword())); 
        
        userRepository.save(user);

        // Generate the token and send it back
        String jwtToken = jwtService.generateToken(user.getEmail());
        return new AuthResponse(jwtToken);
    }

    public AuthResponse login(LoginRequest request) {
        // This will automatically check the database and throw an exception if the password doesn't match
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // If we reach this line, the user is 100% authenticated. Generate their token!
        String jwtToken = jwtService.generateToken(request.getEmail());
        return new AuthResponse(jwtToken);
    }
}