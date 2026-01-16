package com.project.fintrack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.fintrack.entities.NewUser;

@Repository
public interface UserRegistrationRepository extends JpaRepository<NewUser, Integer> {

}
