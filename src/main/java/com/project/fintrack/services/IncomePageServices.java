package com.project.fintrack.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.fintrack.entities.IncomeData;
import com.project.fintrack.entities.NewUser;
import com.project.fintrack.repository.IncomeCrudRepository;
import com.project.fintrack.repository.UserRegistrationRepository;

@Service
public class IncomePageServices {

    @Autowired
    IncomeCrudRepository incRepo;

    @Autowired
    UserRegistrationRepository userRepo;

    public void saveIncome(IncomeData incomeData, String username) {
        NewUser user = userRepo.findByUsername(username).orElseThrow();
        incomeData.setUserId(user.getId());
        incRepo.save(incomeData);
    }

    public List<IncomeData> getAllIncomeRecords(String username) {
        NewUser user = userRepo.findByUsername(username).orElseThrow();
        return incRepo.findAllByUserId(user.getId());
    }

    public IncomeData findIncomeById(Integer id, String username) {
        NewUser user = userRepo.findByUsername(username).orElseThrow();

        IncomeData income = incRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Income not found"));

        if (income.getUserId() != user.getId()) {
            throw new RuntimeException("Unauthorized");
        }

        return income;
    }

    public void save(IncomeData updatedIncome, Integer id, String username) {
        NewUser user = userRepo.findByUsername(username).orElseThrow();

        IncomeData income = incRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Income not found"));

        if (income.getUserId() != user.getId()) {
            throw new RuntimeException("Unauthorized access");
        }

        income.setDate(updatedIncome.getDate());
        income.setAmount(updatedIncome.getAmount());
        income.setSource(updatedIncome.getSource());

        incRepo.save(income);
    }

    public Boolean deleteIncomeRecord(Integer id, String username) {
    	NewUser user = userRepo.findByUsername(username).orElseThrow();
    	  IncomeData income = incRepo.findById(id)
    	            .orElseThrow(() -> new RuntimeException("Income not found"));
    	  
    	  if (income.getUserId() != user.getId()) {
    	        throw new RuntimeException("Unauthorized");
    	    }
    	  
    	  incRepo.deleteById(id);
    	    return true;
    }

    public Map<String, Double> getTotalIncomeBySource(String username) {
    	NewUser user = userRepo.findByUsername(username).orElseThrow();
        List<Object[]> results = incRepo.findTotalIncomeBySourceAndUserId(user.getId());
        Map<String, Double> incomeMap = new HashMap<>();
        for (Object[] row : results) {
            String source = (String) row[0];
            Double total = ((Number) row[1]).doubleValue();
            incomeMap.put(source, total);
        }
        return incomeMap;
    }
}