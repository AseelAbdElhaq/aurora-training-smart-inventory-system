package com.smartinventory.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String phone;

    @Column(name = "role_id")
    private Long roleId;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "user_id", insertable = false, updatable = false)
    private Long userId;

    @Column(name = "is_active")
    private Boolean isActive = true;

    private String username;
    public String getRole() {
    if (roleId == null) {
        return "UNKNOWN";
    }

    if (roleId == 1) {
        return "ADMIN";
    }

    if (roleId == 2) {
        return "INVENTORY_MANAGER";
    }

    if (roleId == 3) {
        return "PURCHASING_MANAGER";
    }

    if (roleId == 4) {
        return "WAREHOUSE_EMPLOYEE";
    }

    return "UNKNOWN";
}
}