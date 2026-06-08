package com.smartinventory.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "warehouses")
public class Warehouse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "warehouse_name", nullable = false)
    private String warehouseName;

    @Column(name = "location")
    private String location;

    @Column(name = "capacity")
    private Integer capacity;

    @Column(name = "current_capacity")
    private Integer currentCapacity = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();

        if (currentCapacity == null) {
            currentCapacity = 0;
        }

        if (isActive == null) {
            isActive = true;
        }
    }

    public Integer getId() {
        return id;
    }

    public String getWarehouseName() {
        return warehouseName;
    }

    public void setWarehouseName(String warehouseName) {
        this.warehouseName = warehouseName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Integer getCurrentCapacity() {
        return currentCapacity;
    }

    public void setCurrentCapacity(Integer currentCapacity) {
        this.currentCapacity = currentCapacity;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean active) {
        isActive = active;
    }
}