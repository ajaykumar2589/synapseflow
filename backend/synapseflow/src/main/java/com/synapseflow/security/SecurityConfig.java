package com.synapseflow.security;

import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter, AuthenticationProvider authenticationProvider) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.authenticationProvider = authenticationProvider;
    }

     @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Ensure CORS is enabled
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) 
            .csrf(csrf -> csrf.disable())
            
            // 2. Update your Authorization Rules
            .authorizeHttpRequests(auth -> auth
                // THE MAGIC FIX: Let all preflight requests pass through freely!
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() 
                
                // Allow public access to your specific login endpoint
                .requestMatchers("/api/v1/auth/**").permitAll()

                .requestMatchers("/api/v1/contact/**").permitAll()

                .requestMatchers("/api/v1/portfolio/**").permitAll()
                
                
                // Lock down everything else
                .anyRequest().authenticated()
            )
            
            // 3. CRITICAL JWT FIXES BELOW:
            // Tell Spring Security NOT to create sessions (since we use stateless JWTs)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            // Tell Spring to use your custom Authentication Provider
            .authenticationProvider(authenticationProvider)
            // Insert your JWT Filter BEFORE the standard username/password filter
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
            
        return http.build();
    }
 @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Explicitly allow your React frontend
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        
        // Allow all standard HTTP methods, especially OPTIONS for preflight
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        
        // Allow the headers React will send (like Content-Type and Authorization)
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); 
        return source;
    }

}