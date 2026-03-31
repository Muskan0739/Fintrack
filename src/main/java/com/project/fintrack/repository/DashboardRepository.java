package com.project.fintrack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.fintrack.entities.DashboardSummary;

import java.util.List;


@Repository
public interface DashboardRepository extends JpaRepository<DashboardSummary, Long>{


    @Query("""
        SELECT FUNCTION('WEEK', i.date) as week, SUM(i.amount) 
        FROM IncomeData i 
        WHERE i.userId = :userId
          AND MONTH(i.date) = MONTH(CURRENT_DATE()) 
          AND YEAR(i.date) = YEAR(CURRENT_DATE()) 
        GROUP BY FUNCTION('WEEK', i.date)
        ORDER BY week
    """)
    List<Object[]> getWeeklyIncomeByUserId(@Param("userId") int userId);

    @Query("""
        SELECT FUNCTION('WEEK', e.date) as week, SUM(e.amount) 
        FROM ExpenseFields e 
        WHERE e.userId = :userId
          AND MONTH(e.date) = MONTH(CURRENT_DATE()) 
          AND YEAR(e.date) = YEAR(CURRENT_DATE()) 
        GROUP BY FUNCTION('WEEK', e.date)
        ORDER BY week
    """)
    List<Object[]> getWeeklyExpenseByUserId(@Param("userId") int userId);

    @Query(value = """
            SELECT category, amount, date, 'expense' as type FROM expense_fields WHERE user_id = :userId
            UNION ALL
            SELECT source, amount, date, 'income' as type FROM income_data WHERE user_id = :userId
            ORDER BY date DESC
            LIMIT 5
        """, nativeQuery = true)
    List<Object[]> fetchRecentTransactionsByUserId(@Param("userId") int userId);
}
