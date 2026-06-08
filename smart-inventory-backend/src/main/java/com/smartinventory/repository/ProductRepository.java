package com.smartinventory.repository;

import com.smartinventory.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    List<Product> findByIsDeletedFalse();

    List<Product> findByProductNameContainingIgnoreCaseAndIsDeletedFalse(String productName);

    boolean existsBySku(String sku);
}