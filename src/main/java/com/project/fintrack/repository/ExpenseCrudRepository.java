package com.project.fintrack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.project.fintrack.entities.ExpenseFields;

@Repository
public interface ExpenseCrudRepository extends JpaRepository<ExpenseFields, Integer> {

	@Query("SELECT SUM(e.amount) from ExpenseFields e WHERE MONTH(e.date) = MONTH(CURRENT_DATE())")
	double totalExpenseForCurrentMonth();
	
	@Query("SELECT SUM(e.amount) from ExpenseFields e")
	double totalExpense();
	
	@Query("SELECT e.category, SUM(e.amount) FROM ExpenseFields e WHERE MONTH(e.date) = MONTH(CURRENT_DATE()) AND YEAR(e.date) = YEAR(CURRENT_DATE()) GROUP BY e.category")
	List<Object[]> getExpenseBreakdownForCurrentMonth();

}
