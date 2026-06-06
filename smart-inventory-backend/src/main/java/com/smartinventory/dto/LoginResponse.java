package com.smartinventory.dto;

public class LoginResponse {

    private String fullName;
    private String username;
    private String email;
    private String role;

    public LoginResponse(
            String fullName,
            String username,
            String email,
            String role
    ) {
        this.fullName = fullName;
        this.username = username;
        this.email = email;
        this.role = role;
    }

    public String getFullName() {
        return fullName;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}