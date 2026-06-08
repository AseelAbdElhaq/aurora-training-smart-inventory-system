package com.smartinventory.repository;

import com.smartinventory.model.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WarehouseRepository extends JpaRepository<Warehouse, Integer> {
    List<Warehouse> findByIsActiveTrue();
}