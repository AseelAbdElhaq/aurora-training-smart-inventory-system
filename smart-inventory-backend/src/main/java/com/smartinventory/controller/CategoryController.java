package com.smartinventory.controller;

import com.smartinventory.model.Category;
import com.smartinventory.repository.CategoryRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:4200")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryRepository.findByIsDeletedFalse();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable Integer id) {
        return categoryRepository.findById(id)
                .filter(category -> !Boolean.TRUE.equals(category.getIsDeleted()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<Category> searchCategories(@RequestParam String keyword) {
        return categoryRepository.findByCategoryNameContainingIgnoreCaseAndIsDeletedFalse(keyword);
    }

    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody Category category) {

        if (categoryRepository.existsByCategoryNameIgnoreCase(category.getCategoryName())) {
            return ResponseEntity.badRequest().body("Category already exists");
        }

        category.setIsDeleted(false);

        return ResponseEntity.ok(categoryRepository.save(category));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(
            @PathVariable Integer id,
            @RequestBody Category updatedCategory
    ) {
        return categoryRepository.findById(id)
                .filter(category -> !Boolean.TRUE.equals(category.getIsDeleted()))
                .map(category -> {
                    category.setCategoryName(updatedCategory.getCategoryName());
                    category.setDescription(updatedCategory.getDescription());

                    return ResponseEntity.ok(categoryRepository.save(category));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Integer id) {
        Category category = categoryRepository.findById(id).orElse(null);

        if (category == null || Boolean.TRUE.equals(category.getIsDeleted())) {
            return ResponseEntity.notFound().build();
        }

        category.setIsDeleted(true);
        categoryRepository.save(category);

        return ResponseEntity.ok("Category deleted successfully");
    }
}