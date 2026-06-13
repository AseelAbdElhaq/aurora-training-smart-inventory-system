package com.smartinventory.controller;

import com.smartinventory.model.*;
import com.smartinventory.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

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
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAllOrders() {
        return salesOrderRepository.findAll().stream().map(this::toDto).toList();
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getOrderById(@PathVariable Integer id) {
        SalesOrder order = salesOrderRepository.findById(id).orElse(null);
        if (order == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(toDto(order));
    }

    @GetMapping("/warehouse/{warehouseId}/products")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getProductsByWarehouse(@PathVariable Integer warehouseId) {
        Warehouse warehouse = warehouseRepository.findById(warehouseId).orElse(null);

        if (warehouse == null) {
            return ResponseEntity.badRequest().body("Warehouse not found");
        }

        List<Map<String, Object>> result = stockRepository.findByWarehouse(warehouse)
                .stream()
                .filter(stock -> stock.getProduct() != null)
                .filter(stock -> stock.getQuantity() != null && stock.getQuantity() > 0)
                .map(stock -> {
                    Product product = stock.getProduct();

                    Map<String, Object> dto = new LinkedHashMap<>();
                    dto.put("id", product.getId());
                    dto.put("productName", product.getProductName());
                    dto.put("sku", product.getSku());
                    dto.put("price", product.getPrice());
                    dto.put("availableQuantity", stock.getQuantity());

                    return dto;
                })
                .toList();

        return ResponseEntity.ok(result);
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> createOrder(@RequestBody SalesOrder request) {
        ResponseEntity<?> validation = validateRequest(request);
        if (validation != null) return validation;

        Warehouse warehouse = warehouseRepository.findById(request.getWarehouse().getId()).orElse(null);
        if (warehouse == null) return ResponseEntity.badRequest().body("Warehouse not found");

        ResponseEntity<?> stockValidation = validateWarehouseStock(request, warehouse);
        if (stockValidation != null) return stockValidation;

        SalesOrder order = new SalesOrder();
        order.setCustomerName(request.getCustomerName());
        order.setWarehouse(warehouse);
        order.setStatus("PENDING");

        BigDecimal total = BigDecimal.ZERO;

        for (SalesOrderItem requestItem : request.getItems()) {
            Product product = productRepository.findById(requestItem.getProduct().getId()).orElse(null);

            SalesOrderItem item = new SalesOrderItem();
            item.setProduct(product);
            item.setQuantity(requestItem.getQuantity());
            item.setUnitPrice(requestItem.getUnitPrice());
            item.setSalesOrder(order);

            total = total.add(requestItem.getUnitPrice().multiply(BigDecimal.valueOf(requestItem.getQuantity())));
            order.getItems().add(item);
        }

        order.setTotalAmount(total);

        SalesOrder saved = salesOrderRepository.save(order);
        return ResponseEntity.ok(toDto(saved));
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> updateOrder(@PathVariable Integer id, @RequestBody SalesOrder request) {
        SalesOrder order = salesOrderRepository.findById(id).orElse(null);

        if (order == null) return ResponseEntity.notFound().build();

        if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
            return ResponseEntity.badRequest().body("Only pending orders can be edited");
        }

        ResponseEntity<?> validation = validateRequest(request);
        if (validation != null) return validation;

        Warehouse warehouse = warehouseRepository.findById(request.getWarehouse().getId()).orElse(null);
        if (warehouse == null) return ResponseEntity.badRequest().body("Warehouse not found");

        ResponseEntity<?> stockValidation = validateWarehouseStock(request, warehouse);
        if (stockValidation != null) return stockValidation;

        order.setCustomerName(request.getCustomerName());
        order.setWarehouse(warehouse);
        order.getItems().clear();

        BigDecimal total = BigDecimal.ZERO;

        for (SalesOrderItem requestItem : request.getItems()) {
            Product product = productRepository.findById(requestItem.getProduct().getId()).orElse(null);

            SalesOrderItem item = new SalesOrderItem();
            item.setProduct(product);
            item.setQuantity(requestItem.getQuantity());
            item.setUnitPrice(requestItem.getUnitPrice());
            item.setSalesOrder(order);

            total = total.add(requestItem.getUnitPrice().multiply(BigDecimal.valueOf(requestItem.getQuantity())));
            order.getItems().add(item);
        }

        order.setTotalAmount(total);

        SalesOrder saved = salesOrderRepository.save(order);
        return ResponseEntity.ok(toDto(saved));
    }

    @PutMapping("/{id}/complete")
    @Transactional
    public ResponseEntity<?> completeOrder(@PathVariable Integer id) {
        SalesOrder order = salesOrderRepository.findById(id).orElse(null);

        if (order == null) return ResponseEntity.notFound().build();

        if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
            return ResponseEntity.badRequest().body("Only pending orders can be completed");
        }

        Warehouse warehouse = order.getWarehouse();

        for (SalesOrderItem item : order.getItems()) {
            Product product = item.getProduct();
            int requestedQuantity = item.getQuantity();

            Stock stock = stockRepository.findByProductAndWarehouse(product, warehouse).orElse(null);

            if (stock == null) {
                return ResponseEntity.badRequest().body("No stock found for product: " + product.getProductName());
            }

            if (stock.getQuantity() == null || stock.getQuantity() < requestedQuantity) {
                return ResponseEntity.badRequest().body("Not enough stock for product: " + product.getProductName());
            }
        }

        int removedQuantity = 0;

        for (SalesOrderItem item : order.getItems()) {
            Product product = item.getProduct();
            int requestedQuantity = item.getQuantity();

            Stock stock = stockRepository.findByProductAndWarehouse(product, warehouse).orElse(null);

            stock.setQuantity(stock.getQuantity() - requestedQuantity);
            stockRepository.save(stock);

            removedQuantity += requestedQuantity;
        }

        if (warehouse.getCurrentCapacity() == null) {
            warehouse.setCurrentCapacity(0);
        }

        warehouse.setCurrentCapacity(Math.max(0, warehouse.getCurrentCapacity() - removedQuantity));
        warehouseRepository.save(warehouse);

        order.setStatus("COMPLETED");

        SalesOrder saved = salesOrderRepository.save(order);
        return ResponseEntity.ok(toDto(saved));
    }

    @PutMapping("/{id}/cancel")
    @Transactional
    public ResponseEntity<?> cancelOrder(@PathVariable Integer id) {
        SalesOrder order = salesOrderRepository.findById(id).orElse(null);

        if (order == null) return ResponseEntity.notFound().build();

        if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
            return ResponseEntity.badRequest().body("Only pending orders can be cancelled");
        }

        order.setStatus("CANCELLED");

        SalesOrder saved = salesOrderRepository.save(order);
        return ResponseEntity.ok(toDto(saved));
    }

    private ResponseEntity<?> validateRequest(SalesOrder order) {
        if (order.getCustomerName() == null || order.getCustomerName().isBlank()) {
            return ResponseEntity.badRequest().body("Customer name is required");
        }

        if (order.getWarehouse() == null || order.getWarehouse().getId() == null) {
            return ResponseEntity.badRequest().body("Warehouse is required");
        }

        if (order.getItems() == null || order.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body("Order items are required");
        }

        for (SalesOrderItem item : order.getItems()) {
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

    private ResponseEntity<?> validateWarehouseStock(SalesOrder request, Warehouse warehouse) {
        for (SalesOrderItem item : request.getItems()) {
            Product product = productRepository.findById(item.getProduct().getId()).orElse(null);

            if (product == null) {
                return ResponseEntity.badRequest().body("Product not found");
            }

            Stock stock = stockRepository.findByProductAndWarehouse(product, warehouse).orElse(null);

            if (stock == null || stock.getQuantity() == null || stock.getQuantity() <= 0) {
                return ResponseEntity.badRequest().body(product.getProductName() + " is not available in this warehouse");
            }

            if (item.getQuantity() > stock.getQuantity()) {
                return ResponseEntity.badRequest().body(
                        "Not enough stock for " + product.getProductName() +
                                ". Available: " + stock.getQuantity()
                );
            }
        }

        return null;
    }

    private Map<String, Object> toDto(SalesOrder order) {
        Map<String, Object> dto = new LinkedHashMap<>();

        dto.put("id", order.getId());
        dto.put("customerName", order.getCustomerName());
        dto.put("status", order.getStatus());
        dto.put("totalAmount", order.getTotalAmount());
        dto.put("createdAt", order.getCreatedAt());

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

        for (SalesOrderItem item : order.getItems()) {
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