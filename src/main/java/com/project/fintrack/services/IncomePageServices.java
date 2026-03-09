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
        return incRepo.findByUserId(user.getId());
    }

    public IncomeData findIncomeById(Integer id) {
        return incRepo.findById(id).orElse(null);
    }

    public void save(IncomeData updatedIncome, Integer id) {
        IncomeData income = incRepo.findById(id).get();
        income.setDate(updatedIncome.getDate());
        income.setAmount(updatedIncome.getAmount());
        income.setSource(updatedIncome.getSource());
        incRepo.save(income);
    }

    public Boolean deleteIncomeRecord(Integer id) {
        Optional<IncomeData> incomeRecord = incRepo.findById(id);
        if (incomeRecord.isPresent()) {
            incRepo.deleteById(id);
            return true;
        }
        return false;
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