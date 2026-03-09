package com.project.fintrack.services;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeSet;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.project.fintrack.repository.DashboardRepository;
import com.project.fintrack.repository.ExpenseCrudRepository;
import com.project.fintrack.repository.IncomeCrudRepository;

import dto.RecentTransactionDTO;

@Service
public class DashboardServices {

	@Autowired 
	private IncomeCrudRepository incomeRepo;
    @Autowired 
    private ExpenseCrudRepository expenseRepo;
    @Autowired
    private DashboardRepository dashboardRepo;
    @Autowired
    private BudgetService budgetService;

   
    //saving card
    public Map<String, Double> calculateSavings() {
    	double totalExpense= expenseRepo.totalExpense();
    	double totalIncome= incomeRepo.totalIncome();
    	
    	
    	double saving= totalIncome- totalExpense;
    	
    	 Map<String, Double> result = new HashMap<>();
         result.put("income", totalIncome);
         result.put("expense", totalExpense);
         result.put("saving", saving);

         return result;
    }
    
    //expense chart
    public Map<String, Double> getExpenseBreakdown() {
        List<Object[]> result = expenseRepo.getExpenseBreakdownForCurrentMonth();
        Map<String, Double> categoryMap = new LinkedHashMap<>();

        for (Object[] row : result) {
            String category = (String) row[0];
            Double amount = (Double) row[1];
            categoryMap.put(category, amount);
        }

        return categoryMap;
    }
    
    //income chart
    public Map<String, Double> getIncomeBreakdown() {
        List<Object[]> result = incomeRepo.getIncomeBreakdownForCurrentMonth();
        Map<String, Double> categoryMap = new LinkedHashMap<>();

        for (Object[] row : result) {
            String category = (String) row[0];
            Double amount = (Double) row[1];
            categoryMap.put(category, amount);
        }

        return categoryMap;
    }

    public Map<String, Double> getWeeklySavingsTrend() {
        Map<Integer, Double> weeklyIncome = new HashMap<>();
        Map<Integer, Double> weeklyExpense = new HashMap<>();
        Map<String, Double> weeklySavings = new LinkedHashMap<>();

        // Fill income map (key = week-of-year from DB)
        for (Object[] row : dashboardRepo.getWeeklyIncome()) {
            Integer week = ((Number) row[0]).intValue();
            Double income = ((Number) row[1]).doubleValue();
            weeklyIncome.put(week, income);
        }

        // Fill expense map
        for (Object[] row : dashboardRepo.getWeeklyExpense()) {
            Integer week = ((Number) row[0]).intValue();
            Double expense = ((Number) row[1]).doubleValue();
            weeklyExpense.put(week, expense);
        }

        // Use the actual weeks we have data for (week-of-year)
        TreeSet<Integer> allWeeks = new TreeSet<>();
        allWeeks.addAll(weeklyIncome.keySet());
        allWeeks.addAll(weeklyExpense.keySet());

        for (Integer week : allWeeks) {
            double income = weeklyIncome.getOrDefault(week, 0.0);
            double expense = weeklyExpense.getOrDefault(week, 0.0);
            weeklySavings.put("Week " + week, income - expense);
        }

        return weeklySavings;
    }
    
    //budget Breakdown section
    public Map<String, Object> getBudgetBreakdown() {

        Double budget = budgetService.getBudgetValue();
        Double expenses = expenseRepo.totalExpense();

        Map<String, Object> response = new HashMap<>();

        if (budget == null || budget <= 0) {
            // align with frontend expectation in dashboardPage.js
            response.put("status", "no-data");
            return response;
        }

        response.put("budget", budget);
        response.put("spent", expenses);
        response.put("remaining", budget - expenses);

        return response;
    }


    public List<RecentTransactionDTO> getRecentTransactions() {
        List<Object[]> rawResults = dashboardRepo.fetchRecentTransactions();

        return rawResults.stream().map(row -> {

            String categoryOrSource = (String) row[0];
            double amount = ((Number) row[1]).doubleValue();

            LocalDate date = ((Date) row[2]).toLocalDate();
            LocalDateTime dateTime = date.atStartOfDay(); // since no time exists

            String type = (String) row[3];

            return new RecentTransactionDTO(
                    categoryOrSource,
                    amount,
                    type,
                    dateTime
            );

        }).collect(Collectors.toList());
    }

}

