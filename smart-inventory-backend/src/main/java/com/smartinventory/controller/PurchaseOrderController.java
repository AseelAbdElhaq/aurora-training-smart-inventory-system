package com.smartinventory.controller;

import com.smartinventory.model.*;
import com.smartinventory.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

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
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAllOrders() {
        return purchaseOrderRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getOrderById(@PathVariable Integer id) {
        PurchaseOrder order = purchaseOrderRepository.findById(id).orElse(null);

        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(toDto(order));
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> createOrder(@RequestBody PurchaseOrder request) {
        ResponseEntity<?> validation = validateRequest(request);
        if (validation != null) return validation;

        Supplier supplier = supplierRepository.findById(request.getSupplier().getId()).orElse(null);
        Warehouse warehouse = warehouseRepository.findById(request.getWarehouse().getId()).orElse(null);

        if (supplier == null) return ResponseEntity.badRequest().body("Supplier not found");
        if (warehouse == null) return ResponseEntity.badRequest().body("Warehouse not found");

        PurchaseOrder order = new PurchaseOrder();
        order.setSupplier(supplier);
        order.setWarehouse(warehouse);
        order.setStatus("PENDING");

        BigDecimal total = BigDecimal.ZERO;

        for (PurchaseOrderItem requestItem : request.getItems()) {
            Product product = productRepository.findById(requestItem.getProduct().getId()).orElse(null);

            if (product == null) {
                return ResponseEntity.badRequest().body("Product not found");
            }

            PurchaseOrderItem item = new PurchaseOrderItem();
            item.setProduct(product);
            item.setQuantity(requestItem.getQuantity());
            item.setUnitPrice(requestItem.getUnitPrice());
            item.setPurchaseOrder(order);

            total = total.add(
                    requestItem.getUnitPrice().multiply(BigDecimal.valueOf(requestItem.getQuantity()))
            );

            order.getItems().add(item);
        }

        order.setTotalAmount(total);

        PurchaseOrder saved = purchaseOrderRepository.save(order);
        return ResponseEntity.ok(toDto(saved));
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> updateOrder(@PathVariable Integer id, @RequestBody PurchaseOrder request) {
        PurchaseOrder order = purchaseOrderRepository.findById(id).orElse(null);

        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
            return ResponseEntity.badRequest().body("Only pending orders can be edited");
        }

        ResponseEntity<?> validation = validateRequest(request);
        if (validation != null) return validation;

        Supplier supplier = supplierRepository.findById(request.getSupplier().getId()).orElse(null);
        Warehouse warehouse = warehouseRepository.findById(request.getWarehouse().getId()).orElse(null);

        if (supplier == null) return ResponseEntity.badRequest().body("Supplier not found");
        if (warehouse == null) return ResponseEntity.badRequest().body("Warehouse not found");

        order.setSupplier(supplier);
        order.setWarehouse(warehouse);
        order.getItems().clear();

        BigDecimal total = BigDecimal.ZERO;

        for (PurchaseOrderItem requestItem : request.getItems()) {
            Product product = productRepository.findById(requestItem.getProduct().getId()).orElse(null);

            if (product == null) {
                return ResponseEntity.badRequest().body("Product not found");
            }

            PurchaseOrderItem item = new PurchaseOrderItem();
            item.setProduct(product);
            item.setQuantity(requestItem.getQuantity());
            item.setUnitPrice(requestItem.getUnitPrice());
            item.setPurchaseOrder(order);

            total = total.add(
                    requestItem.getUnitPrice().multiply(BigDecimal.valueOf(requestItem.getQuantity()))
            );

            order.getItems().add(item);
        }

        order.setTotalAmount(total);

        PurchaseOrder saved = purchaseOrderRepository.save(order);
        return ResponseEntity.ok(toDto(saved));
    }

    @PutMapping("/{id}/receive")
    @Transactional
    public ResponseEntity<?> receiveOrder(@PathVariable Integer id) {
        PurchaseOrder order = purchaseOrderRepository.findById(id).orElse(null);

        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
            return ResponseEntity.badRequest().body("Only pending orders can be received");
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
                        newStock.setIsDeleted(false);
                        return newStock;
                    });

            if (stock.getQuantity() == null) {
                stock.setQuantity(0);
            }

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

        warehouse.setCurrentCapacity(warehouse.getCurrentCapacity() + addedQuantity);
        warehouseRepository.save(warehouse);

        order.setStatus("RECEIVED");

        PurchaseOrder saved = purchaseOrderRepository.save(order);
        return ResponseEntity.ok(toDto(saved));
    }

    @PutMapping("/{id}/cancel")
    @Transactional
    public ResponseEntity<?> cancelOrder(@PathVariable Integer id) {
        PurchaseOrder order = purchaseOrderRepository.findById(id).orElse(null);

        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
            return ResponseEntity.badRequest().body("Only pending orders can be cancelled");
        }

        order.setStatus("CANCELLED");

        PurchaseOrder saved = purchaseOrderRepository.save(order);
        return ResponseEntity.ok(toDto(saved));
    }

    private ResponseEntity<?> validateRequest(PurchaseOrder order) {
        if (order.getSupplier() == null || order.getSupplier().getId() == null) {
            return ResponseEntity.badRequest().body("Supplier is required");
        }

        if (order.getWarehouse() == null || order.getWarehouse().getId() == null) {
            return ResponseEntity.badRequest().body("Warehouse is required");
        }

        if (order.getItems() == null || order.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body("Order items are required");
        }

        for (PurchaseOrderItem item : order.getItems()) {
            if (item.getProduct() == null || item.getProduct().getId() == null) {
                return ResponseEntity.badRequest().body("Product is required");
            }

            if (item.getQuantity() == null || item.getQuantity() <= 0) {
                return ResponseEntity.badRequest().body("Quantity must be greater than zero");
            }

            if (item.getUnitPrice() == null || item.getUnitPrice().compareTo(BigDecimal.ZERO) < 0) {
                return ResponseEntity.badRequest().body("Unit price is invalid");
            }
        }

        return null;
    }

    private Map<String, Object> toDto(PurchaseOrder order) {
        Map<String, Object> dto = new LinkedHashMap<>();

        dto.put("id", order.getId());
        dto.put("status", order.getStatus());
        dto.put("totalAmount", order.getTotalAmount());
        dto.put("createdAt", order.getCreatedAt());

        Map<String, Object> supplier = new LinkedHashMap<>();
        if (order.getSupplier() != null) {
            supplier.put("id", order.getSupplier().getId());
            supplier.put("supplierName", order.getSupplier().getSupplierName());
        }
        dto.put("supplier", supplier);

        Map<String, Object> warehouse = new LinkedHashMap<>();
        if (order.getWarehouse() != null) {
            warehouse.put("id", order.getWarehouse().getId());
            warehouse.put("warehouseName", order.getWarehouse().getWarehouseName());
            warehouse.put("location", order.getWarehouse().getLocation());
            warehouse.put("capacity", order.getWarehouse().getCapacity());
            warehouse.put("currentCapacity", order.getWarehouse().getCurrentCapacity());
        }
        dto.put("warehouse", warehouse);

        List<Map<String, Object>> items = new ArrayList<>();

        for (PurchaseOrderItem item : order.getItems()) {
            Map<String, Object> itemDto = new LinkedHashMap<>();

            itemDto.put("id", item.getId());
            itemDto.put("quantity", item.getQuantity());
            itemDto.put("unitPrice", item.getUnitPrice());

            Map<String, Object> product = new LinkedHashMap<>();

            if (item.getProduct() != null) {
                product.put("id", item.getProduct().getId());
                product.put("productName", item.getProduct().getProductName());
                product.put("sku", item.getProduct().getSku());
                product.put("price", item.getProduct().getPrice());
            }

            itemDto.put("product", product);
            items.add(itemDto);
        }

        dto.put("items", items);

        return dto;
    }
}