package com.project.fintrack.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.fintrack.entities.Budget;
import com.project.fintrack.repository.BudgetRepository;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    public void saveOrUpdateBudget(Double amount) {

        List<Budget> budgets = budgetRepository.findAll();

        if (!budgets.isEmpty()) {
            // Update existing budget
            Budget existing = budgets.get(0);
            existing.setBudget(amount);
            budgetRepository.save(existing);
        } else {
            // Create new budget
            Budget budget = new Budget();
            budget.setBudget(amount);
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
}
