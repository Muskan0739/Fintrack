package com.project.fintrack.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.fintrack.entities.NewUser;
import com.project.fintrack.repository.UserRegistrationRepository;

@Service
public class UserRegistrationServices {

    @Autowired
    UserRegistrationRepository urp;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String saveUser(NewUser user) {
        if (urp.findByUsername(user.getUsername()).isPresent()) {
            return "exists";
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        urp.save(user);
        return "saved";
    }
}