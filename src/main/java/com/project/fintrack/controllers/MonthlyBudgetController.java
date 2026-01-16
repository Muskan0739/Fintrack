package com.project.fintrack.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.project.fintrack.entities.Budget;
import com.project.fintrack.services.BudgetService;

@RestController
public class MonthlyBudgetController {

    @Autowired
    private BudgetService budgetService;

    @PostMapping("/expensePage")
    public ResponseEntity<String> saveMonthlyBudget(@RequestBody Budget budget) {

        if (budget.getBudget() == null || budget.getBudget() <= 0) {
            return ResponseEntity.badRequest().body("Budget must be greater than 0");
        }

        budgetService.saveOrUpdateBudget(budget.getBudget());

        return ResponseEntity.ok("Budget set successfully");
    }
}
