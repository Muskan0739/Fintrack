package com.project.fintrack.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class DashboardSummary {

	   @Id
	   private Long id;
	   
	   private Double totalIncome;
	   private Double totalExpense;
	   private Double remainingBalance;
	   
	   private int userId;

	    public int getUserId() {
			return userId;
		}

		public void setUserId(int userId) {
			this.userId = userId;
		}

	   // Getters and Setters
	   public Double getTotalIncome() {
	       return totalIncome;
	   }

	   public void setTotalIncome(Double totalIncome) {
	       this.totalIncome = totalIncome;
	   }

	   public Double getTotalExpense() {
	       return totalExpense;
	   }

	   public void setTotalExpense(Double totalExpense) {
	       this.totalExpense = totalExpense;
	   }

	   public Double getRemainingBalance() {
	       return remainingBalance;
	   }

	   public void setRemainingBalance(Double remainingBalance) {
	       this.remainingBalance = remainingBalance;
	   }
}
