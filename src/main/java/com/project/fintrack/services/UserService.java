package com.project.fintrack.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.project.fintrack.entities.NewUser;
import com.project.fintrack.repository.UserRegistrationRepository;

@Service
public class UserService {
    
    @Autowired
    private UserRegistrationRepository userRepository;
    
    public NewUser getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    public int getCurrentUserId() {
        return getCurrentUser().getId();
    }
}