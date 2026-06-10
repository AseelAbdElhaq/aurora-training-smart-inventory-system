package com.smartinventory.controller;

import com.smartinventory.model.*;
import com.smartinventory.repository.*;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/purchase-orders")
@CrossOrigin(origins = "http://localhost:4200")
public class PurchaseOrderController {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final SupplierRepository supplierRepository;
    private final WarehouseRepository warehouseRepository;
    private final ProductRepository productRepository;
    private final StockRepository stockRepository;
    private final StockMovementRepository stockMovementRepository;

    public PurchaseOrderController(
            PurchaseOrderRepository purchaseOrderRepository,
            SupplierRepository supplierRepository,
            WarehouseRepository warehouseRepository,
            ProductRepository productRepository,
            StockRepository stockRepository,
            StockMovementRepository stockMovementRepository
    ) {
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.supplierRepository = supplierRepository;
        this.warehouseRepository = warehouseRepository;
        this.productRepository = productRepository;
        this.stockRepository = stockRepository;
        this.stockMovementRepository = stockMovementRepository;
    }

    @GetMapping
    public List<PurchaseOrder> getAllOrders() {
        return purchaseOrderRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Integer id) {
        return purchaseOrderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<PurchaseOrder> searchByStatus(@RequestParam String status) {
        return purchaseOrderRepository.findByStatusContainingIgnoreCase(status);
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody PurchaseOrder order) {

        if (order.getSupplier() == null || order.getSupplier().getId() == null) {
            return ResponseEntity.badRequest().body("Supplier is required");
        }

        if (order.getWarehouse() == null || order.getWarehouse().getId() == null) {
            return ResponseEntity.badRequest().body("Warehouse is required");
        }

        if (order.getItems() == null || order.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body("Order items are required");
        }

        Supplier supplier = supplierRepository
                .findById(order.getSupplier().getId())
                .orElse(null);

        Warehouse warehouse = warehouseRepository
                .findById(order.getWarehouse().getId())
                .orElse(null);

        if (supplier == null) {
            return ResponseEntity.badRequest().body("Supplier not found");
        }

        if (warehouse == null) {
            return ResponseEntity.badRequest().body("Warehouse not found");
        }

        order.setSupplier(supplier);
        order.setWarehouse(warehouse);
        order.setStatus("PENDING");

        BigDecimal total = BigDecimal.ZERO;

        for (PurchaseOrderItem item : order.getItems()) {

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
            item.setPurchaseOrder(order);

            BigDecimal itemTotal = item.getUnitPrice()
                    .multiply(BigDecimal.valueOf(item.getQuantity()));

            total = total.add(itemTotal);
        }

        order.setTotalAmount(total);

        return ResponseEntity.ok(purchaseOrderRepository.save(order));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrder(
            @PathVariable Integer id,
            @RequestBody PurchaseOrder updatedOrder
    ) {
        return purchaseOrderRepository.findById(id)
                .map(order -> {

                    if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
                        return ResponseEntity.badRequest()
                                .body("Only pending orders can be edited");
                    }

                    Supplier supplier = supplierRepository
                            .findById(updatedOrder.getSupplier().getId())
                            .orElse(null);

                    Warehouse warehouse = warehouseRepository
                            .findById(updatedOrder.getWarehouse().getId())
                            .orElse(null);

                    if (supplier == null || warehouse == null) {
                        return ResponseEntity.badRequest()
                                .body("Supplier or warehouse not found");
                    }

                    order.setSupplier(supplier);
                    order.setWarehouse(warehouse);

                    BigDecimal total = BigDecimal.ZERO;

                    order.getItems().clear();

                    for (PurchaseOrderItem item : updatedOrder.getItems()) {

                        Product product = productRepository
                                .findById(item.getProduct().getId())
                                .orElse(null);

                        if (product == null) {
                            return ResponseEntity.badRequest()
                                    .body("Product not found");
                        }

                        item.setProduct(product);
                        item.setPurchaseOrder(order);

                        BigDecimal itemTotal = item.getUnitPrice()
                                .multiply(BigDecimal.valueOf(item.getQuantity()));

                        total = total.add(itemTotal);

                        order.addItem(item);
                    }

                    order.setTotalAmount(total);

                    return ResponseEntity.ok(purchaseOrderRepository.save(order));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/receive")
    public ResponseEntity<?> receiveOrder(@PathVariable Integer id) {

        PurchaseOrder order = purchaseOrderRepository.findById(id).orElse(null);

        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
            return ResponseEntity.badRequest()
                    .body("Only pending orders can be received");
        }

        Warehouse warehouse = order.getWarehouse();

        int addedQuantity = 0;

        for (PurchaseOrderItem item : order.getItems()) {

            Product product = item.getProduct();
            int quantity = item.getQuantity();

            Stock stock = stockRepository
                    .findByProductAndWarehouse(product, warehouse)
                    .orElseGet(() -> {
                        Stock newStock = new Stock();
                        newStock.setProduct(product);
                        newStock.setWarehouse(warehouse);
                        newStock.setQuantity(0);
                        return newStock;
                    });

            stock.setQuantity(stock.getQuantity() + quantity);
            stockRepository.save(stock);

            StockMovement movement = new StockMovement();
            movement.setProduct(product);
            movement.setWarehouse(warehouse);
            movement.setMovementType("PURCHASE_RECEIVE");
            movement.setQuantity(quantity);
            movement.setNotes("Received from purchase order #" + order.getId());

            stockMovementRepository.save(movement);

            addedQuantity += quantity;
        }

        if (warehouse.getCurrentCapacity() == null) {
            warehouse.setCurrentCapacity(0);
        }

        warehouse.setCurrentCapacity(
                warehouse.getCurrentCapacity() + addedQuantity
        );

        warehouseRepository.save(warehouse);

        order.setStatus("RECEIVED");

        return ResponseEntity.ok(purchaseOrderRepository.save(order));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Integer id) {

        return purchaseOrderRepository.findById(id)
                .map(order -> {

                    if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
                        return ResponseEntity.badRequest()
                                .body("Only pending orders can be cancelled");
                    }

                    order.setStatus("CANCELLED");

                    return ResponseEntity.ok(purchaseOrderRepository.save(order));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}