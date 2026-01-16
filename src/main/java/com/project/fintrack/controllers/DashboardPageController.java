package com.project.fintrack.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
	 
	 @GetMapping(path="/saving-summary")
	 public ResponseEntity<Map<String, Double>> savingTicketData(){
		 Map<String, Double> data= dashboardService.calculateSavings();
		 
		 return ResponseEntity.ok(data);
	 }
	 
	 @GetMapping("/expense-breakdown")
	 public ResponseEntity<Map<String, Double>> getExpenseBreakdown() {
	     Map<String, Double> breakdown = dashboardService.getExpenseBreakdown();
	     return ResponseEntity.ok(breakdown);
	 }
	 
	 @GetMapping("/income-breakdown")
	 public ResponseEntity<Map<String, Double>> getIncomeBreakdown() {
	     Map<String, Double> breakdown = dashboardService.getIncomeBreakdown();
	     return ResponseEntity.ok(breakdown);
	 }

	 @GetMapping("/savings-trend")
	 public ResponseEntity<Map<String, Double>> getSavingsTrend() {
	     return ResponseEntity.ok(dashboardService.getWeeklySavingsTrend());
	 }

	 @GetMapping("/budget-breakdown")
	 public ResponseEntity<Map<String, Object>> getBudgetBreakdown() {
	     Map<String, Object> breakdown = dashboardService.getBudgetBreakdown();
	     return ResponseEntity.ok(breakdown);
	 }

	 @GetMapping("/recent-transactions")
	 public ResponseEntity<List<RecentTransactionDTO>> getRecentTransactions() {
	     return ResponseEntity.ok(dashboardService.getRecentTransactions());
	 }


}
