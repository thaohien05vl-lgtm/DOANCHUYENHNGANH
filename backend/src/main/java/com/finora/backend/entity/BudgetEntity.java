package com.finora.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "budgets")
public class BudgetEntity extends OwnedEntity {
    @Column(nullable = false, length = 240, name = "category_id")
    private String categoryId;
    @Column(nullable = false, name = "limit_amount")
    private java.math.BigDecimal limitAmount;

    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }
    public java.math.BigDecimal getLimitAmount() { return limitAmount; }
    public void setLimitAmount(java.math.BigDecimal limitAmount) { this.limitAmount = limitAmount; }
}
