package com.project.fintrack.services;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.fintrack.entities.ExpenseFields;
import com.project.fintrack.repository.ExpenseCrudRepository;

@Service
public class ExpensePageServices {

	@Autowired
	ExpenseCrudRepository ecr;
	
	public void saveExpense(ExpenseFields expenseField) {
		
		ecr.save(expenseField);
		
	}
	
	public List<ExpenseFields> getExpenseRecord(){
		return ecr.findAll();
	}
	
	public ExpenseFields returnExpenseWithId(Integer id){
		return ecr.findById(id).orElse(null);
		
	}
	
	public ExpenseFields saveUpdatedExpense(Integer id,ExpenseFields updatedExpense) {
		ExpenseFields expense= ecr.findById(id).get();
		
		expense.setCategory(updatedExpense.getCategory());
		expense.setDate(updatedExpense.getDate());
		expense.setAmount(updatedExpense.getAmount());
		expense.setNote(updatedExpense.getNote());
		
		return ecr.save(expense);
		
	}

	public Boolean deleteOneRow(Integer id) {
		ecr.deleteById(id);
		
		if(ecr.findById(id).isEmpty()) {
			return true;
		}
		else 
		{
			return false;
		}
	}


}
