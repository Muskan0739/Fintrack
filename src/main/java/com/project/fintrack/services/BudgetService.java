package com.project.fintrack.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.fintrack.entities.Budget;
import com.project.fintrack.repository.BudgetRepository;
import com.project.fintrack.services.UserService;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;
    
    @Autowired
    private UserService userService;

    public void saveOrUpdateBudget(Double amount) {
        int userId = userService.getCurrentUserId();
        
        List<Budget> budgets = budgetRepository.findLatestBudgetByUserId(userId);

        if (!budgets.isEmpty()) {
            // Update existing budget
            Budget existing = budgets.get(0);
            existing.setBudget(amount);
            existing.setUserId(userId);
            budgetRepository.save(existing);
        } else {
            // Create new budget
            Budget budget = new Budget();
            budget.setBudget(amount);
            budget.setUserId(userId);
            budgetRepository.save(budget);
        }
    }

    public Double getBudgetValue() {
        int userId = userService.getCurrentUserId();
        List<Double> budgets = budgetRepository.findBudgetValuesByUserId(userId);

        if (budgets.isEmpty()) {
            return null;
        }
        return budgets.get(0);
    }
}
