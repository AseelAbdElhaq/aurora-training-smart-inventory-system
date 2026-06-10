package com.smartinventory.repository;

import com.smartinventory.model.SalesOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SalesOrderRepository extends JpaRepository<SalesOrder, Integer> {

    List<SalesOrder> findByStatusContainingIgnoreCase(String status);

    List<SalesOrder> findByCustomerNameContainingIgnoreCase(String customerName);
}