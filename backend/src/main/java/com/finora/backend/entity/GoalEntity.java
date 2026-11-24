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
    @Column(name = "alert_threshold")
    private Integer alertThreshold = 80;
    @Column(name = "alert_sent_threshold")
    private Integer alertSentThreshold = 0;

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
    public Integer getAlertThreshold() { return alertThreshold != null ? alertThreshold : 80; }
    public void setAlertThreshold(Integer alertThreshold) { this.alertThreshold = alertThreshold != null ? alertThreshold : 80; }
    public Integer getAlertSentThreshold() { return alertSentThreshold != null ? alertSentThreshold : 0; }
    public void setAlertSentThreshold(Integer alertSentThreshold) { this.alertSentThreshold = alertSentThreshold != null ? alertSentThreshold : 0; }
}
