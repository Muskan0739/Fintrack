package com.project.fintrack.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.fintrack.entities.IncomeData;
import com.project.fintrack.repository.IncomeCrudRepository;

@Service
public class IncomePageServices {

	@Autowired
	IncomeCrudRepository incRepo;
	
	public void saveIncome(IncomeData incomedata) {
		incRepo.save(incomedata);
	}
	
	public List<IncomeData> getAllIncomeRecords(){
		return incRepo.findAll();
	}
	
	public IncomeData findIncomeById(Integer id) {
		return incRepo.findById(id).orElse(null);
	}

	public void save(IncomeData updatedIncome, Integer id) {
		IncomeData income= incRepo.findById(id).get();
		
		income.setId(updatedIncome.getId());
		income.setDate(updatedIncome.getDate());
		income.setAmount(updatedIncome.getAmount());
		income.setSource(updatedIncome.getSource());
		
		incRepo.save(income);
	}
	
	public Boolean deleteIncomeRecord(Integer id) {
	    // Check if the record exists first
	    Optional<IncomeData> incomeRecord = incRepo.findById(id);

	    // If the record exists, proceed with delete
	    if (incomeRecord.isPresent()) {
	        incRepo.deleteById(id);
	        return true;  // Successfully deleted
	    } else {
	        return false;  // Record not found, nothing to delete
	    }
	}
	
	public Map<String, Double> getTotalIncomeBySource() {
	    List<Object[]> results = incRepo.findTotalIncomeBySource();
	    Map<String, Double> incomeMap = new HashMap<>();

	    for (Object[] row : results) {
	        String source = (String) row[0];
	        Double total = ((Number) row[1]).doubleValue();
	        incomeMap.put(source, total);
	    }

	    return incomeMap;
	}



}
