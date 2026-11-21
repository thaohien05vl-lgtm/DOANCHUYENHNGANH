package com.finora.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "goals")
public class GoalEntity extends OwnedEntity {
    @Column(nullable = false, columnDefinition = "nvarchar(80)", name = "name")
    private String name;
    @Column(nullable = false, name = "target_amount")
    private java.math.BigDecimal targetAmount;
    @Column(nullable = false, name = "saved_amount")
    private java.math.BigDecimal savedAmount;
    @Column(nullable = false, name = "due_date")
    private java.time.LocalDate dueDate;
    @Column(nullable = false, length = 240, name = "color")
    private String color;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public java.math.BigDecimal getTargetAmount() { return targetAmount; }
    public void setTargetAmount(java.math.BigDecimal targetAmount) { this.targetAmount = targetAmount; }
    public java.math.BigDecimal getSavedAmount() { return savedAmount; }
    public void setSavedAmount(java.math.BigDecimal savedAmount) { this.savedAmount = savedAmount; }
    public java.time.LocalDate getDueDate() { return dueDate; }
    public void setDueDate(java.time.LocalDate dueDate) { this.dueDate = dueDate; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
}
