package com.smartinventory.controller;

import com.smartinventory.model.Category;
import com.smartinventory.model.Product;
import com.smartinventory.model.Supplier;
import com.smartinventory.repository.CategoryRepository;
import com.smartinventory.repository.ProductRepository;
import com.smartinventory.repository.SupplierRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;

    public ProductController(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            SupplierRepository supplierRepository
    ) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.supplierRepository = supplierRepository;
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findByIsDeletedFalse();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Integer id) {
        return productRepository.findById(id)
                .filter(product -> !Boolean.TRUE.equals(product.getIsDeleted()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String keyword) {
        return productRepository
                .findByProductNameContainingIgnoreCaseAndIsDeletedFalse(keyword);
    }

    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody Product product) {

        if (product.getSku() != null && productRepository.existsBySku(product.getSku())) {
            return ResponseEntity.badRequest().body("SKU already exists");
        }

        product.setIsDeleted(false);

        if (product.getCategory() != null && product.getCategory().getId() != null) {
            Category category = categoryRepository.findById(product.getCategory().getId())
                    .orElse(null);
            product.setCategory(category);
        }

        if (product.getSupplier() != null && product.getSupplier().getId() != null) {
            Supplier supplier = supplierRepository.findById(product.getSupplier().getId())
                    .orElse(null);
            product.setSupplier(supplier);
        }

        return ResponseEntity.ok(productRepository.save(product));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Integer id,
            @RequestBody Product updatedProduct
    ) {
        return productRepository.findById(id)
                .filter(product -> !Boolean.TRUE.equals(product.getIsDeleted()))
                .map(product -> {
                    product.setProductName(updatedProduct.getProductName());
                    product.setSku(updatedProduct.getSku());
                    product.setDescription(updatedProduct.getDescription());
                    product.setPrice(updatedProduct.getPrice());
                    product.setQuantity(updatedProduct.getQuantity());
                    product.setImageUrl(updatedProduct.getImageUrl());

                    if (updatedProduct.getCategory() != null && updatedProduct.getCategory().getId() != null) {
                        Category category = categoryRepository.findById(updatedProduct.getCategory().getId())
                                .orElse(null);
                        product.setCategory(category);
                    } else {
                        product.setCategory(null);
                    }

                    if (updatedProduct.getSupplier() != null && updatedProduct.getSupplier().getId() != null) {
                        Supplier supplier = supplierRepository.findById(updatedProduct.getSupplier().getId())
                                .orElse(null);
                        product.setSupplier(supplier);
                    } else {
                        product.setSupplier(null);
                    }

                    return ResponseEntity.ok(productRepository.save(product));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Integer id) {
        Product product = productRepository.findById(id).orElse(null);

        if (product == null || Boolean.TRUE.equals(product.getIsDeleted())) {
            return ResponseEntity.notFound().build();
        }

        product.setIsDeleted(true);
        productRepository.save(product);

        return ResponseEntity.ok("Product deleted successfully");
    }
}