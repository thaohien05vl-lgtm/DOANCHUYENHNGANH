package com.finora.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class OwnedEntity {
    @Id
    @Column(length = 64)
    protected String id;

    @Column(nullable = false, length = 36, name = "user_id")
    protected String userId;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
}
