package com.smartinventory.repository;

import com.smartinventory.model.Stock;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StockRepository extends JpaRepository<Stock, Integer> {

    List<Stock> findByIsDeletedFalse();

    Optional<Stock> findByProductIdAndWarehouseIdAndIsDeletedFalse(
            Integer productId,
            Integer warehouseId
    );
}