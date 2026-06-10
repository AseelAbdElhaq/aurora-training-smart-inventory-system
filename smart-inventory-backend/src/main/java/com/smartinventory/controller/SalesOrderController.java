package com.smartinventory.controller;

import com.smartinventory.model.*;
import com.smartinventory.repository.*;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/sales-orders")
@CrossOrigin(origins = "http://localhost:4200")
public class SalesOrderController {

    private final SalesOrderRepository salesOrderRepository;
    private final WarehouseRepository warehouseRepository;
    private final ProductRepository productRepository;
    private final StockRepository stockRepository;

    public SalesOrderController(
            SalesOrderRepository salesOrderRepository,
            WarehouseRepository warehouseRepository,
            ProductRepository productRepository,
            StockRepository stockRepository
    ) {
        this.salesOrderRepository = salesOrderRepository;
        this.warehouseRepository = warehouseRepository;
        this.productRepository = productRepository;
        this.stockRepository = stockRepository;
    }

    @GetMapping
    public List<SalesOrder> getAllOrders() {
        return salesOrderRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Integer id) {
        return salesOrderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody SalesOrder order) {

        if (order.getCustomerName() == null || order.getCustomerName().isBlank()) {
            return ResponseEntity.badRequest().body("Customer name is required");
        }

        if (order.getWarehouse() == null || order.getWarehouse().getId() == null) {
            return ResponseEntity.badRequest().body("Warehouse is required");
        }

        if (order.getItems() == null || order.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body("Order items are required");
        }

        Warehouse warehouse = warehouseRepository
                .findById(order.getWarehouse().getId())
                .orElse(null);

        if (warehouse == null) {
            return ResponseEntity.badRequest().body("Warehouse not found");
        }

        order.setWarehouse(warehouse);
        order.setStatus("PENDING");

        BigDecimal total = BigDecimal.ZERO;

        for (SalesOrderItem item : order.getItems()) {

            if (item.getProduct() == null || item.getProduct().getId() == null) {
                return ResponseEntity.badRequest().body("Product is required");
            }

            Product product = productRepository
                    .findById(item.getProduct().getId())
                    .orElse(null);

            if (product == null) {
                return ResponseEntity.badRequest().body("Product not found");
            }

            if (item.getQuantity() == null || item.getQuantity() <= 0) {
                return ResponseEntity.badRequest().body("Quantity must be greater than zero");
            }

            if (item.getUnitPrice() == null || item.getUnitPrice().compareTo(BigDecimal.ZERO) < 0) {
                return ResponseEntity.badRequest().body("Unit price is invalid");
            }

            item.setProduct(product);
            item.setSalesOrder(order);

            BigDecimal itemTotal = item.getUnitPrice()
                    .multiply(BigDecimal.valueOf(item.getQuantity()));

            total = total.add(itemTotal);
        }

        order.setTotalAmount(total);

        return ResponseEntity.ok(salesOrderRepository.save(order));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrder(
            @PathVariable Integer id,
            @RequestBody SalesOrder updatedOrder
    ) {
        return salesOrderRepository.findById(id)
                .map(order -> {

                    if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
                        return ResponseEntity.badRequest()
                                .body("Only pending orders can be edited");
                    }

                    Warehouse warehouse = warehouseRepository
                            .findById(updatedOrder.getWarehouse().getId())
                            .orElse(null);

                    if (warehouse == null) {
                        return ResponseEntity.badRequest().body("Warehouse not found");
                    }

                    order.setCustomerName(updatedOrder.getCustomerName());
                    order.setWarehouse(warehouse);

                    BigDecimal total = BigDecimal.ZERO;

                    order.getItems().clear();

                    for (SalesOrderItem item : updatedOrder.getItems()) {

                        Product product = productRepository
                                .findById(item.getProduct().getId())
                                .orElse(null);

                        if (product == null) {
                            return ResponseEntity.badRequest()
                                    .body("Product not found");
                        }

                        item.setProduct(product);
                        item.setSalesOrder(order);

                        BigDecimal itemTotal = item.getUnitPrice()
                                .multiply(BigDecimal.valueOf(item.getQuantity()));

                        total = total.add(itemTotal);

                        order.addItem(item);
                    }

                    order.setTotalAmount(total);

                    return ResponseEntity.ok(salesOrderRepository.save(order));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeOrder(@PathVariable Integer id) {

        SalesOrder order = salesOrderRepository.findById(id).orElse(null);

        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
            return ResponseEntity.badRequest()
                    .body("Only pending orders can be completed");
        }

        Warehouse warehouse = order.getWarehouse();

        for (SalesOrderItem item : order.getItems()) {

            Product product = item.getProduct();
            int requestedQuantity = item.getQuantity();

            Stock stock = stockRepository
                    .findByProductAndWarehouse(product, warehouse)
                    .orElse(null);

            if (stock == null) {
                return ResponseEntity.badRequest()
                        .body("No stock found for product: " + product.getProductName());
            }

            if (stock.getQuantity() < requestedQuantity) {
                return ResponseEntity.badRequest()
                        .body("Not enough stock for product: " + product.getProductName());
            }
        }

        int removedQuantity = 0;

        for (SalesOrderItem item : order.getItems()) {

            Product product = item.getProduct();
            int requestedQuantity = item.getQuantity();

            Stock stock = stockRepository
                    .findByProductAndWarehouse(product, warehouse)
                    .orElse(null);

            stock.setQuantity(stock.getQuantity() - requestedQuantity);
            stockRepository.save(stock);

            removedQuantity += requestedQuantity;
        }

        if (warehouse.getCurrentCapacity() == null) {
            warehouse.setCurrentCapacity(0);
        }

        warehouse.setCurrentCapacity(
                Math.max(0, warehouse.getCurrentCapacity() - removedQuantity)
        );

        warehouseRepository.save(warehouse);

        order.setStatus("COMPLETED");

        return ResponseEntity.ok(salesOrderRepository.save(order));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Integer id) {

        return salesOrderRepository.findById(id)
                .map(order -> {

                    if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
                        return ResponseEntity.badRequest()
                                .body("Only pending orders can be cancelled");
                    }

                    order.setStatus("CANCELLED");

                    return ResponseEntity.ok(salesOrderRepository.save(order));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}