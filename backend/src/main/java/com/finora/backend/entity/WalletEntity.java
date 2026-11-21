package com.finora.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "wallets")
public class WalletEntity extends OwnedEntity {
    @Column(nullable = false, columnDefinition = "nvarchar(80)", name = "name")
    private String name;
    @Column(nullable = false, length = 240, name = "wallet_type")
    private String type;
    @Column(nullable = false, name = "initial_balance")
    private java.math.BigDecimal initialBalance;
    @Column(nullable = false, length = 240, name = "color")
    private String color;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public java.math.BigDecimal getInitialBalance() { return initialBalance; }
    public void setInitialBalance(java.math.BigDecimal initialBalance) { this.initialBalance = initialBalance; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
}
