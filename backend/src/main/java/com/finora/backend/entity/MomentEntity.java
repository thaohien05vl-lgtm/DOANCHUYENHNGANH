package com.finora.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "moments")
public class MomentEntity extends OwnedEntity {
    @Column(nullable = false, name = "moment_date")
    private java.time.LocalDate momentDate;
    @Column(columnDefinition = "nvarchar(240)", name = "caption")
    private String caption;
    @Column(nullable = false, columnDefinition = "nvarchar(max)", name = "image_data")
    private String imageData;
    @Column(nullable = false, name = "created_at")
    private java.time.Instant createdAt;

    public java.time.LocalDate getMomentDate() { return momentDate; }
    public void setMomentDate(java.time.LocalDate momentDate) { this.momentDate = momentDate; }
    public String getCaption() { return caption; }
    public void setCaption(String caption) { this.caption = caption; }
    public String getImageData() { return imageData; }
    public void setImageData(String imageData) { this.imageData = imageData; }
    public java.time.Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(java.time.Instant createdAt) { this.createdAt = createdAt; }
}
