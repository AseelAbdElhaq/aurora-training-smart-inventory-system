package com.smartinventory.controller;

import com.smartinventory.model.User;
import com.smartinventory.repository.UserRepository;
import com.smartinventory.service.EmailService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    private final UserRepository userRepository;
    private final EmailService emailService;

    public UserController(
            UserRepository userRepository,
            EmailService emailService
    ) {
        this.userRepository = userRepository;
        this.emailService = emailService;
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

        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        if (user.getRoleId() == null) {
            user.setRoleId(4L);
        }

        user.setIsActive(true);

        User saved = userRepository.save(user);

        try {
            emailService.sendUserAccountEmail(saved);
        } catch (Exception e) {
            System.out.println("Email send failed: " + e.getMessage());
        }

        return ResponseEntity.ok(toDto(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Integer id,
            @RequestBody User data
    ) {
        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        Optional<User> emailOwner = userRepository.findByEmail(data.getEmail());
        if (emailOwner.isPresent() && !emailOwner.get().getId().equals(id)) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        Optional<User> usernameOwner = userRepository.findByUsername(data.getUsername());
        if (usernameOwner.isPresent() && !usernameOwner.get().getId().equals(id)) {
            return ResponseEntity.badRequest().body("Username already exists");
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

        if (user.getRoleId() != null && user.getRoleId() == 1L) {
            return ResponseEntity.badRequest().body("Main admin account cannot be deleted");
        }

        user.setIsActive(false);
        userRepository.save(user);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/profile/email/{email}")
    public ResponseEntity<?> getProfileByEmail(@PathVariable String email) {
        User user = userRepository.findByEmailAndIsActiveTrue(email).orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(toDto(user));
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<?> updateProfile(
            @PathVariable Integer id,
            @RequestBody User data
    ) {
        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        Optional<User> emailOwner = userRepository.findByEmail(data.getEmail());
        if (emailOwner.isPresent() && !emailOwner.get().getId().equals(id)) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        Optional<User> usernameOwner = userRepository.findByUsername(data.getUsername());
        if (usernameOwner.isPresent() && !usernameOwner.get().getId().equals(id)) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        user.setFullName(data.getFullName());
        user.setUsername(data.getUsername());
        user.setEmail(data.getEmail());
        user.setPhone(data.getPhone());

        if (data.getPassword() != null && !data.getPassword().isBlank()) {
            user.setPassword(data.getPassword());
        }

        User saved = userRepository.save(user);

        return ResponseEntity.ok(toDto(saved));
    }

    private Map<String, Object> toDto(User user) {
        Map<String, Object> dto = new HashMap<>();

        dto.put("id", user.getId());
        dto.put("fullName", user.getFullName());
        dto.put("email", user.getEmail());
        dto.put("password", user.getPassword());
        dto.put("phone", user.getPhone());
        dto.put("username", user.getUsername());
        dto.put("roleId", user.getRoleId());
        dto.put("role", user.getRole());
        dto.put("isActive", user.getIsActive());

        return dto;
    }
}