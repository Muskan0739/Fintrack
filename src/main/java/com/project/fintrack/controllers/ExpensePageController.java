package com.project.fintrack.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.project.fintrack.entities.ExpenseFields;
import com.project.fintrack.services.ExpensePageServices;

import jakarta.validation.Valid;

@RestController
public class ExpensePageController {

    @Autowired
    ExpensePageServices expenseServices;

    private String getLoggedInUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @PostMapping(path="/addExpense")
    public ResponseEntity<String> saveExpense(@Valid @RequestBody ExpenseFields expenseField){
        expenseServices.saveExpense(expenseField, getLoggedInUsername());
        return ResponseEntity.ok("Expense data added");
    }

    @GetMapping(path="/api/expenses")
    public ResponseEntity<List<ExpenseFields>> showTableRecord(){
        return new ResponseEntity<>(expenseServices.getExpenseRecord(getLoggedInUsername()), HttpStatus.OK);
    }

    @GetMapping("/addExpense/{id}")
    public ResponseEntity<ExpenseFields> getExpenseFormById(@PathVariable("id") Integer id){
        ExpenseFields expense = expenseServices.returnExpenseWithId(id);
        if (expense != null) return ResponseEntity.ok(expense);
        else return ResponseEntity.notFound().build();
    }

    @PutMapping("/addExpense/{id}")
    public ResponseEntity<ExpenseFields> updateExpense(@PathVariable Integer id, @RequestBody ExpenseFields updatedExpense) {
        ExpenseFields saved = expenseServices.saveUpdatedExpense(id, updatedExpense);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping(path="/expensePage/{id}")
    public ResponseEntity<String> deleteRow(@PathVariable Integer id){
        Boolean deletedRow = expenseServices.deleteOneRow(id);
        if(deletedRow) return ResponseEntity.ok("One Row Deleted");
        else return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Body not found");
    }
}
