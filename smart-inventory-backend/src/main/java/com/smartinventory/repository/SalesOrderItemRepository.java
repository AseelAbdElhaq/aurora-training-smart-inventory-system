package com.smartinventory.repository;

import com.smartinventory.model.SalesOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SalesOrderItemRepository extends JpaRepository<SalesOrderItem, Integer> {
}