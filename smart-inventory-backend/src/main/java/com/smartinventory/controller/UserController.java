package com.smartinventory.controller;

import com.smartinventory.model.User;
import com.smartinventory.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Map<String, Object>> getUsers() {
        return userRepository.findAll()
                .stream()
                .filter(user -> user.getIsActive() == null || user.getIsActive())
                .map(this::toDto)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Integer id) {
        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(toDto(user));
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        if (user.getFullName() == null || user.getFullName().isBlank()) {
            return ResponseEntity.badRequest().body("Full name is required");
        }

        if (user.getUsername() == null || user.getUsername().isBlank()) {
            return ResponseEntity.badRequest().body("Username is required");
        }

        if (user.getEmail() == null || user.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        if (user.getPassword() == null || user.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body("Password is required");
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        user.setIsActive(true);

        User saved = userRepository.save(user);
        return ResponseEntity.ok(toDto(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Integer id, @RequestBody User data) {
        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        user.setFullName(data.getFullName());
        user.setUsername(data.getUsername());
        user.setEmail(data.getEmail());
        user.setPhone(data.getPhone());
        user.setRoleId(data.getRoleId());

        if (data.getPassword() != null && !data.getPassword().isBlank()) {
            user.setPassword(data.getPassword());
        }

        if (user.getIsActive() == null) {
            user.setIsActive(true);
        }

        User saved = userRepository.save(user);
        return ResponseEntity.ok(toDto(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> softDeleteUser(@PathVariable Integer id) {
        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        user.setIsActive(false);
        userRepository.save(user);

        return ResponseEntity.ok().build();
    }

    private Map<String, Object> toDto(User user) {
        Map<String, Object> dto = new LinkedHashMap<>();

        dto.put("id", user.getId());
        dto.put("fullName", user.getFullName());
        dto.put("username", user.getUsername());
        dto.put("email", user.getEmail());
        dto.put("password", user.getPassword());
        dto.put("phone", user.getPhone());
        dto.put("roleId", user.getRoleId());
        dto.put("isActive", user.getIsActive());

        return dto;
    }
}