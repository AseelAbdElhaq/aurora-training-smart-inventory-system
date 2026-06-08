package com.smartinventory.repository;

import com.smartinventory.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

    List<Category> findByIsDeletedFalse();

    List<Category> findByCategoryNameContainingIgnoreCaseAndIsDeletedFalse(String categoryName);

    boolean existsByCategoryNameIgnoreCase(String categoryName);
}