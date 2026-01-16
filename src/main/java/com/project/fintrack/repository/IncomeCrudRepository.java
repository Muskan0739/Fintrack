package com.project.fintrack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.project.fintrack.entities.IncomeData;

@Repository
public interface IncomeCrudRepository extends JpaRepository<IncomeData, Integer> {

	@Query("SELECT i.source, SUM(i.amount) FROM IncomeData i GROUP BY i.source")
	List<Object[]> findTotalIncomeBySource();

	@Query("SELECT SUM(i.amount) from IncomeData i")
	double totalIncome();
	
	@Query("SELECT i.source, SUM(i.amount) FROM IncomeData i WHERE MONTH(i.date) = MONTH(CURRENT_DATE()) AND YEAR(i.date) = YEAR(CURRENT_DATE()) GROUP BY i.source")
	List<Object[]> getIncomeBreakdownForCurrentMonth();

}
