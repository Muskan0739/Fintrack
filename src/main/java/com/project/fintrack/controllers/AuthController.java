package com.project.fintrack.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.project.fintrack.entities.NewUser;
import com.project.fintrack.security.CustomUserDetailsService;
import com.project.fintrack.security.JwtUtil;

@RestController
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/api/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody NewUser loginRequest) {
        try {
            System.out.println("🔍 AuthController: Attempting login for user: " + loginRequest.getUsername());
            
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );

            System.out.println("✅ AuthController: Authentication successful for user: " + loginRequest.getUsername());
            
            String token = jwtUtil.generateToken(loginRequest.getUsername());
            System.out.println("✅ AuthController: JWT token generated: " + token.substring(0, Math.min(20, token.length())) + "...");

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("username", loginRequest.getUsername());

            System.out.println("✅ AuthController: Login response prepared successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println("❌ AuthController: Login failed for user: " + loginRequest.getUsername() + " - " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Invalid username or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
}