package com.project.fintrack.controllers;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class HomePageController {
	

	//home page GET API
	@GetMapping(path = "/home")
	public String showHomepage() {
		return "forward:/index.html";
	}

	//User registration form GET API
	@GetMapping(path= "/userRegistration")
	public String showRegistrationPage() {
        return "forward:/userRegistrationForm.html";
    }
	
	//Income page GET API
	@GetMapping(path= "/income")
	public String showIncomePage() {
		return "forward:/incomePage.html";
	}
	
	//Expense page GET API
	@GetMapping(path= "/expensePage")
	public String showExpensePage() {
		return "forward:/expensePage.html";
	}
	
	//Add expense form GET API
	@GetMapping(path="/addExpense")
	public String showAddExpenseForm() {
		return "forward:/addExpenseForm.html";
	}
	
	//Dashboard GET API
	@GetMapping(path= "/dashboard")
	public String showDashboard() {
		return "forward:/dashboardPage.html";
	}
	
	

}