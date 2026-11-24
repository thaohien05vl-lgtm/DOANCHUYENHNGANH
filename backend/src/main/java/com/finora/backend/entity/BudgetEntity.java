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
    @Column(length = 7, name = "ky_ngan_sach")
    private String kyNganSach;
    @Column(name = "thang")
    private Integer thang;
    @Column(name = "nam")
    private Integer nam;

    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }
    public java.math.BigDecimal getLimitAmount() { return limitAmount; }
    public void setLimitAmount(java.math.BigDecimal limitAmount) { this.limitAmount = limitAmount; }
    public String getKyNganSach() { return kyNganSach; }
    public void setKyNganSach(String kyNganSach) { this.kyNganSach = kyNganSach; }
    public Integer getThang() { return thang; }
    public void setThang(Integer thang) { this.thang = thang; }
    public Integer getNam() { return nam; }
    public void setNam(Integer nam) { this.nam = nam; }
}
