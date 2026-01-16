package com.project.fintrack.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.fintrack.entities.NewUser;
import com.project.fintrack.repository.UserRegistrationRepository;

@Service
public class UserRegistrationServices {
	
	@Autowired
	UserRegistrationRepository urp;
	
	public void saveUser(NewUser user) {
		try {
			urp.save(user);
		}
		catch(Exception e) {
			System.out.println(e);
		}
		
	}
	
}
