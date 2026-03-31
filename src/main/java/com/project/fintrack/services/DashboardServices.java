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

import com.project.fintrack.entities.NewUser;
import com.project.fintrack.repository.DashboardRepository;
import com.project.fintrack.repository.ExpenseCrudRepository;
import com.project.fintrack.repository.IncomeCrudRepository;
import com.project.fintrack.repository.UserRegistrationRepository;

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
    @Autowired
    private UserRegistrationRepository userRepo;

    private int getUserId(String username) {
        NewUser user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        return user.getId();
    }

    // Saving card — scoped to logged-in user
    public Map<String, Double> calculateSavings(String username) {
        int userId = getUserId(username);

        Double totalExpenseRaw = expenseRepo.totalExpenseByUserId(userId);
        Double totalIncomeRaw  = incomeRepo.totalIncomeByUserId(userId);

        double totalExpense = totalExpenseRaw != null ? totalExpenseRaw : 0.0;
        double totalIncome  = totalIncomeRaw  != null ? totalIncomeRaw  : 0.0;
        double saving       = totalIncome - totalExpense;

        Map<String, Double> result = new HashMap<>();
        result.put("income",  totalIncome);
        result.put("expense", totalExpense);
        result.put("saving",  saving);
        return result;
    }

    // Expense chart — scoped to logged-in user
    public Map<String, Double> getExpenseBreakdown(String username) {
        int userId = getUserId(username);
        List<Object[]> result = expenseRepo.getExpenseBreakdownForCurrentMonthByUserId(userId);
        Map<String, Double> categoryMap = new LinkedHashMap<>();
        for (Object[] row : result) {
            String category = (String) row[0];
            Double amount   = (Double) row[1];
            categoryMap.put(category, amount);
        }
        return categoryMap;
    }

    // Income chart — scoped to logged-in user
    public Map<String, Double> getIncomeBreakdown(String username) {
        int userId = getUserId(username);
        List<Object[]> result = incomeRepo.getIncomeBreakdownForCurrentMonthByUserId(userId);
        Map<String, Double> categoryMap = new LinkedHashMap<>();
        for (Object[] row : result) {
            String category = (String) row[0];
            Double amount   = (Double) row[1];
            categoryMap.put(category, amount);
        }
        return categoryMap;
    }

    // Weekly savings trend — scoped to logged-in user
    public Map<String, Double> getWeeklySavingsTrend(String username) {
        int userId = getUserId(username);

        Map<Integer, Double> weeklyIncome  = new HashMap<>();
        Map<Integer, Double> weeklyExpense = new HashMap<>();
        Map<String, Double>  weeklySavings = new LinkedHashMap<>();

        for (Object[] row : dashboardRepo.getWeeklyIncomeByUserId(userId)) {
            Integer week   = ((Number) row[0]).intValue();
            Double  income = ((Number) row[1]).doubleValue();
            weeklyIncome.put(week, income);
        }

        for (Object[] row : dashboardRepo.getWeeklyExpenseByUserId(userId)) {
            Integer week    = ((Number) row[0]).intValue();
            Double  expense = ((Number) row[1]).doubleValue();
            weeklyExpense.put(week, expense);
        }

        TreeSet<Integer> allWeeks = new TreeSet<>();
        allWeeks.addAll(weeklyIncome.keySet());
        allWeeks.addAll(weeklyExpense.keySet());

        for (Integer week : allWeeks) {
            double income  = weeklyIncome.getOrDefault(week, 0.0);
            double expense = weeklyExpense.getOrDefault(week, 0.0);
            weeklySavings.put("Week " + week, income - expense);
        }

        return weeklySavings;
    }

    // Budget breakdown — scoped to logged-in user
    public Map<String, Object> getBudgetBreakdown(String username) {
        int userId = getUserId(username);

        Double budget   = budgetService.getBudgetValueForUser(userId);
        Double expensesRaw = expenseRepo.totalExpenseByUserId(userId);
        Double expenses = expensesRaw != null ? expensesRaw : 0.0;

        Map<String, Object> response = new HashMap<>();

        if (budget == null || budget <= 0) {
            response.put("status", "no-data");
            return response;
        }

        response.put("budget",    budget);
        response.put("spent",     expenses);
        response.put("remaining", budget - expenses);
        return response;
    }

    // Recent transactions — scoped to logged-in user
    public List<RecentTransactionDTO> getRecentTransactions(String username) {
        int userId = getUserId(username);
        List<Object[]> rawResults = dashboardRepo.fetchRecentTransactionsByUserId(userId);

        return rawResults.stream().map(row -> {
            String    categoryOrSource = (String) row[0];
            double    amount           = ((Number) row[1]).doubleValue();
            LocalDate date             = ((Date) row[2]).toLocalDate();
            LocalDateTime dateTime     = date.atStartOfDay();
            String    type             = (String) row[3];

            return new RecentTransactionDTO(categoryOrSource, amount, type, dateTime);
        }).collect(Collectors.toList());
    }
}
