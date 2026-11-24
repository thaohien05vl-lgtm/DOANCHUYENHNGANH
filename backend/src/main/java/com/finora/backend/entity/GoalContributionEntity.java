package com.finora.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "goal_contributions")
public class GoalContributionEntity extends OwnedEntity {

    @Column(name = "goal_id", nullable = false, length = 64)
    private String goalId;

    @Column(name = "wallet_id", nullable = false, length = 64)
    private String walletId;

    @Column(name = "wallet_name", nullable = false, columnDefinition = "nvarchar(80)")
    private String walletName;

    @Column(name = "amount", nullable = false)
    private BigDecimal amount;

    @Column(name = "saved_amount_after", nullable = false)
    private BigDecimal savedAmountAfter;

    @Column(name = "note", columnDefinition = "nvarchar(500)")
    private String note;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public String getGoalId() { return goalId; }
    public void setGoalId(String goalId) { this.goalId = goalId; }

    public String getWalletId() { return walletId; }
    public void setWalletId(String walletId) { this.walletId = walletId; }

    public String getWalletName() { return walletName; }
    public void setWalletName(String walletName) { this.walletName = walletName; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public BigDecimal getSavedAmountAfter() { return savedAmountAfter; }
    public void setSavedAmountAfter(BigDecimal savedAmountAfter) { this.savedAmountAfter = savedAmountAfter; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
