package com.finora.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "app_notifications")
public class NotificationEntity extends OwnedEntity {

    @Column(length = 64, name = "transaction_id")
    private String transactionId;

    @Column(nullable = false, length = 50, name = "type")
    private String type;

    @Column(nullable = false, columnDefinition = "nvarchar(200)", name = "title")
    private String title;

    @Column(nullable = false, columnDefinition = "nvarchar(1000)", name = "content")
    private String content;

    @Column(nullable = false, name = "is_read")
    private boolean read = false;

    @Column(nullable = false, name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

