package com.project.fintrack.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class HomePageController {

    //home page GET API
    @GetMapping(path = "/home")
    public String showHomepage() {
        return "redirect:/index.html";
    }

    @GetMapping(path = "/login")
    public String showLoginPage() {
        return "redirect:/loginPage.html";
    }

    //User registration form GET API
    @GetMapping(path= "/userRegistration")
    public String showRegistrationPage() {
        return "redirect:/userRegistrationForm.html";
    }

    //Income page GET API
    @GetMapping(path= "/income")
    public String showIncomePage() {
        return "redirect:/incomePage.html";
    }

    //Expense page GET API
    @GetMapping(path= "/expensePage")
    public String showExpensePage() {
        return "redirect:/expensePage.html";
    }

    //Add expense form GET API (preserve id query param for edit mode)
    @GetMapping(path="/addExpense")
    public String showAddExpenseForm(@RequestParam(name = "id", required = false) Integer id) {
        if (id != null) {
            return "redirect:/addExpenseForm.html?id=" + id;
        }
        return "redirect:/addExpenseForm.html";
    }

    //Dashboard GET API
    @GetMapping(path= "/dashboard")
    public String showDashboard() {
        return "redirect:/dashboardPage.html";
    }
}