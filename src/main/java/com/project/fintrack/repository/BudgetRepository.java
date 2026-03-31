package com.project.fintrack.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.fintrack.entities.Budget;

public interface BudgetRepository extends JpaRepository<Budget, Integer> {

    @Query("SELECT b.budget FROM Budget b ORDER BY b.id ASC")
    List<Double> findBudgetValues();

    @Query("SELECT b FROM Budget b WHERE b.userId = :userId ORDER BY b.id ASC")
    List<Budget> findByUserId(@Param("userId") int userId);
}
