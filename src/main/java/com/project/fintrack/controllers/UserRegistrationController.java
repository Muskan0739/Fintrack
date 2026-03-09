package com.project.fintrack.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.project.fintrack.entities.NewUser;
import com.project.fintrack.services.UserRegistrationServices;

import jakarta.servlet.http.HttpSession;

@RestController
public class UserRegistrationController {
	
	@Autowired
	UserRegistrationServices urs;
	 
	@PostMapping(path = "/userRegistration")
	public ResponseEntity<Map<String, Object>> saveUser(@RequestBody NewUser user) {
	    String result = urs.saveUser(user);

	    Map<String, Object> response = new HashMap<>();
	    if (result.equals("exists")) {
	        response.put("error", "Username already exists!");
	        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
	    }

	    response.put("message", "User registered successfully");
	    response.put("username", user.getUsername());
	    return ResponseEntity.ok(response);
	}

    //New API: Get current logged-in username from session
    @GetMapping("/currentUser")
    public ResponseEntity<Map<String, Object>> getCurrentUser(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        String username = (String) session.getAttribute("username");

        if (username != null) {
            response.put("username", username);
        } else {
            response.put("username", "");
        }

        return ResponseEntity.ok(response);
    }
}
