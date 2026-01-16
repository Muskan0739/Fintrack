package com.project.fintrack.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.project.fintrack.entities.IncomeData;
import com.project.fintrack.services.IncomePageServices;

import jakarta.validation.Valid;

@RestController
public class IncomePageController {

	@Autowired
	IncomePageServices incomeService;
	
	@PostMapping(path="/income")
	@ResponseBody
	public ResponseEntity<String> saveIncomeData(@Valid @RequestBody IncomeData incomeData){
		incomeService.saveIncome(incomeData);
		
		return ResponseEntity.ok("Data saved successfully");
	}

	@GetMapping(path="/income/data")
	public ResponseEntity<List<IncomeData>> getIncomeData()
	{
		return new ResponseEntity<>(incomeService.getAllIncomeRecords(), HttpStatus.OK);
	}
	
	@GetMapping(path="/income/{id}")
	public ResponseEntity<IncomeData> getIncomeById(@PathVariable("id") Integer id){
		IncomeData income= incomeService.findIncomeById(id);
		
		if(income!= null) {
			return ResponseEntity.ok(income);
		}
		else {
			return ResponseEntity.notFound().build();
		}
	}
	
	@PutMapping("/income/{id}")
	public ResponseEntity<String> updateIncome(@PathVariable Integer id, @Valid @RequestBody IncomeData updatedIncome) {
	    incomeService.save(updatedIncome, id); // or your update method
	    return ResponseEntity.ok("Income updated");
	}
	
	@DeleteMapping("/income/{id}")
	public ResponseEntity<String> deleteIncomeRow(@PathVariable("id") Integer id){
		Boolean deletedRow= incomeService.deleteIncomeRecord(id);
		
		if(deletedRow) {
			return ResponseEntity.ok("Row deleted");
		}
		else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Body not found");
		}
	}
	
	@GetMapping("/income/sources")
	@ResponseBody
	public Map<String, Double> getIncomeBySource() {
	    return incomeService.getTotalIncomeBySource();
	}


}