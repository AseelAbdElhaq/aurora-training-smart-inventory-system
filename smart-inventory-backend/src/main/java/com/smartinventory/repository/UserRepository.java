package com.smartinventory.repository;

import com.smartinventory.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    List<User> findByIsActiveTrue();

    Optional<User> findByEmail(String email);

    Optional<User> findByEmailAndIsActiveTrue(String email);

    Optional<User> findByUsername(String username);

    Optional<User> findByUsernameAndIsActiveTrue(String username);
}