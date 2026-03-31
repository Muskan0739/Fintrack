package com.project.fintrack.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.fintrack.services.DashboardServices;

import dto.RecentTransactionDTO;

@RestController
@RequestMapping("/dashboard")
public class DashboardPageController {

    @Autowired 
    private DashboardServices dashboardService;

    private String getLoggedInUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @GetMapping("/saving-summary")
    public ResponseEntity<Map<String, Double>> savingTicketData(){
        return ResponseEntity.ok(
            dashboardService.calculateSavings(getLoggedInUsername())
        );
    }

    @GetMapping("/expense-breakdown")
    public ResponseEntity<Map<String, Double>> getExpenseBreakdown() {
        return ResponseEntity.ok(
            dashboardService.getExpenseBreakdown(getLoggedInUsername())
        );
    }

    @GetMapping("/income-breakdown")
    public ResponseEntity<Map<String, Double>> getIncomeBreakdown() {
        return ResponseEntity.ok(
            dashboardService.getIncomeBreakdown(getLoggedInUsername())
        );
    }

    @GetMapping("/savings-trend")
    public ResponseEntity<Map<String, Double>> getSavingsTrend() {
        return ResponseEntity.ok(
            dashboardService.getWeeklySavingsTrend(getLoggedInUsername())
        );
    }

    @GetMapping("/budget-breakdown")
    public ResponseEntity<Map<String, Object>> getBudgetBreakdown() {
        return ResponseEntity.ok(
            dashboardService.getBudgetBreakdown(getLoggedInUsername())
        );
    }

    @GetMapping("/recent-transactions")
    public ResponseEntity<List<RecentTransactionDTO>> getRecentTransactions() {
        return ResponseEntity.ok(
            dashboardService.getRecentTransactions(getLoggedInUsername())
        );
    }
}