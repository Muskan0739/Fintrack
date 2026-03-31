package com.project.fintrack.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.fintrack.entities.Budget;
import com.project.fintrack.entities.NewUser;
import com.project.fintrack.repository.BudgetRepository;
import com.project.fintrack.repository.UserRegistrationRepository;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private UserRegistrationRepository userRepo;
    
    public void saveOrUpdateBudget(Double amount) {
        List<Budget> budgets = budgetRepository.findAll();
        if (!budgets.isEmpty()) {
            Budget existing = budgets.get(0);
            existing.setBudget(amount);
            budgetRepository.save(existing);
        } else {
            Budget budget = new Budget();
            budget.setBudget(amount);
            budgetRepository.save(budget);
        }
    }

    //save or update budget for a specific user
    public void saveOrUpdateBudgetForUser(Double amount, String username) {
        NewUser user = userRepo.findByUsername(username).orElseThrow();
        int userId = user.getId();

        List<Budget> budgets = budgetRepository.findByUserId(userId);
        if (!budgets.isEmpty()) {
            Budget existing = budgets.get(0);
            existing.setBudget(amount);
            budgetRepository.save(existing);
        } else {
            Budget budget = new Budget();
            budget.setBudget(amount);
            budget.setUserId(userId);
            budgetRepository.save(budget);
        }
    }

    public Double getBudgetValue() {
        List<Double> budgets = budgetRepository.findBudgetValues();
        if (budgets.isEmpty()) {
            return null;
        }
        return budgets.get(0);
    }

    //get budget value for a specific user
    public Double getBudgetValueForUser(int userId) {
        List<Budget> budgets = budgetRepository.findByUserId(userId);
        if (budgets.isEmpty()) {
            return null;
        }
        return budgets.get(0).getBudget();
    }
}
