package com.finora.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "financial_transactions")
public class TransactionEntity extends OwnedEntity {
    @Column(nullable = false, length = 240, name = "transaction_type")
    private String type;
    @Column(nullable = false, name = "amount")
    private java.math.BigDecimal amount;
    @Column(nullable = false, length = 240, name = "category_id")
    private String categoryId;
    @Column(nullable = false, length = 240, name = "wallet_id")
    private String walletId;
    @Column(nullable = false, name = "transaction_date")
    private java.time.LocalDate transactionDate;
    @Column(columnDefinition = "nvarchar(1200)", name = "note")
    private String note;
    @Column(length = 240, name = "recurring_type")
    private String recurringType;

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public java.math.BigDecimal getAmount() { return amount; }
    public void setAmount(java.math.BigDecimal amount) { this.amount = amount; }
    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }
    public String getWalletId() { return walletId; }
    public void setWalletId(String walletId) { this.walletId = walletId; }
    public java.time.LocalDate getTransactionDate() { return transactionDate; }
    public void setTransactionDate(java.time.LocalDate transactionDate) { this.transactionDate = transactionDate; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    public String getRecurringType() { return recurringType; }
    public void setRecurringType(String recurringType) { this.recurringType = recurringType; }
}
