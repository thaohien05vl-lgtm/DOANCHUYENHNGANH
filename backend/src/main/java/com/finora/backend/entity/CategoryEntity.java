package com.finora.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "categories")
public class CategoryEntity extends OwnedEntity {
    @Column(nullable = false, columnDefinition = "nvarchar(80)", name = "name")
    private String name;
    @Column(nullable = false, length = 240, name = "category_type")
    private String type;
    @Column(nullable = false, length = 1000, name = "icon")
    private String icon;
    @Column(nullable = false, length = 240, name = "color")
    private String color;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
}
