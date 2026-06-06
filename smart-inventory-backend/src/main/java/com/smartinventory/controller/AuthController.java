package com.smartinventory.controller;

import com.smartinventory.dto.LoginRequest;
import com.smartinventory.dto.LoginResponse;
import com.smartinventory.model.User;
import com.smartinventory.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        Optional<User> userOptional =
                userRepository.findByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
            return ResponseEntity
                    .status(401)
                    .body("Invalid email or password");
        }

        User user = userOptional.get();

        if (!request.getPassword().equals(user.getPassword())) {
            return ResponseEntity
                    .status(401)
                    .body("Invalid email or password");
        }

        return ResponseEntity.ok(
                new LoginResponse(
                        user.getFullName(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getRole().getRoleName()
                )
        );
    }
}