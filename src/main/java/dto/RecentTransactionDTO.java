package dto;

import java.time.LocalDateTime;

public class RecentTransactionDTO {

    private String category;
    private double amount;
    private String type; // "income" or "expense"
    private LocalDateTime date;

    public RecentTransactionDTO(String category, double amount, String type, LocalDateTime date) {
        this.category = category;
        this.amount = amount;
        this.type = type;
        this.date = date;
    }

    public String getCategory() {
        return category;
    }

    public double getAmount() {
        return amount;
    }

    public String getType() {
        return type;
    }

    public LocalDateTime getDate() {
        return date;
    }
}
