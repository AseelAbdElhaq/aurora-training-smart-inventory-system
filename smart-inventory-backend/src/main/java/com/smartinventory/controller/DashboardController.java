package com.smartinventory.controller;

import com.smartinventory.model.*;
import com.smartinventory.repository.*;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:4200")
public class DashboardController {

    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final SupplierRepository supplierRepository;
    private final StockRepository stockRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final SalesOrderRepository salesOrderRepository;
    private final StockMovementRepository stockMovementRepository;

    public DashboardController(
            ProductRepository productRepository,
            WarehouseRepository warehouseRepository,
            SupplierRepository supplierRepository,
            StockRepository stockRepository,
            PurchaseOrderRepository purchaseOrderRepository,
            SalesOrderRepository salesOrderRepository,
            StockMovementRepository stockMovementRepository
    ) {
        this.productRepository = productRepository;
        this.warehouseRepository = warehouseRepository;
        this.supplierRepository = supplierRepository;
        this.stockRepository = stockRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.salesOrderRepository = salesOrderRepository;
        this.stockMovementRepository = stockMovementRepository;
    }

    @GetMapping("/summary")
    public Map<String, Object> getSummary() {
        List<Product> products = productRepository.findByIsDeletedFalse();
        List<Warehouse> warehouses = warehouseRepository.findByIsActiveTrue();
        List<Supplier> suppliers = supplierRepository.findByIsDeletedFalse();
        List<Stock> stocks = stockRepository.findByIsDeletedFalse();

        int totalStock = stocks.stream()
                .mapToInt(s -> s.getQuantity() == null ? 0 : s.getQuantity())
                .sum();

        long lowStock = stocks.stream()
                .filter(s -> s.getQuantity() != null && s.getQuantity() <= 5)
                .count();

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("totalProducts", products.size());
        data.put("totalWarehouses", warehouses.size());
        data.put("totalSuppliers", suppliers.size());
        data.put("totalStock", totalStock);
        data.put("totalPurchaseOrders", purchaseOrderRepository.count());
        data.put("totalSalesOrders", salesOrderRepository.count());
        data.put("lowStockAlerts", lowStock);

        return data;
    }

    @GetMapping("/warehouse-capacity")
    public List<Map<String, Object>> getWarehouseCapacity() {
        List<Map<String, Object>> result = new ArrayList<>();

        for (Warehouse warehouse : warehouseRepository.findByIsActiveTrue()) {
            int capacity = warehouse.getCapacity() == null ? 0 : warehouse.getCapacity();
            int used = warehouse.getCurrentCapacity() == null ? 0 : warehouse.getCurrentCapacity();

            double percentage = capacity == 0 ? 0 : (used * 100.0 / capacity);

            Map<String, Object> item = new LinkedHashMap<>();
            item.put("warehouseName", warehouse.getWarehouseName());
            item.put("capacity", capacity);
            item.put("used", used);
            item.put("available", Math.max(0, capacity - used));
            item.put("percentage", Math.round(percentage));

            result.add(item);
        }

        return result;
    }

    @GetMapping("/recent-activities")
    public List<Map<String, Object>> getRecentActivities() {
        List<StockMovement> movements = stockMovementRepository.findAll();

        movements.sort((a, b) -> {
            if (a.getMovementDate() == null || b.getMovementDate() == null) {
                return 0;
            }
            return b.getMovementDate().compareTo(a.getMovementDate());
        });

        return movements.stream()
                .limit(6)
                .map(movement -> {
                    Map<String, Object> item = new LinkedHashMap<>();

                    String productName = movement.getProduct() == null
                            ? "Product"
                            : movement.getProduct().getProductName();

                    String warehouseName = movement.getWarehouse() == null
                            ? "Warehouse"
                            : movement.getWarehouse().getWarehouseName();

                    item.put("title", movement.getMovementType() + " - " + productName);
                    item.put("warehouseName", warehouseName);
                    item.put("quantity", movement.getQuantity());
                    item.put("movementType", movement.getMovementType());
                    item.put("movementDate", movement.getMovementDate());

                    return item;
                })
                .toList();
    }

    @GetMapping("/top-products")
    public List<Map<String, Object>> getTopProducts() {
        Map<Integer, Map<String, Object>> productSales = new HashMap<>();

        for (SalesOrder order : salesOrderRepository.findAll()) {
            if (!"COMPLETED".equalsIgnoreCase(order.getStatus())) {
                continue;
            }

            for (SalesOrderItem item : order.getItems()) {
                if (item.getProduct() == null) {
                    continue;
                }

                Integer productId = item.getProduct().getId();

                productSales.putIfAbsent(productId, new LinkedHashMap<>());

                Map<String, Object> productData = productSales.get(productId);

                productData.put("productName", item.getProduct().getProductName());
                productData.put("sku", item.getProduct().getSku());

                int oldQuantity = productData.get("soldQuantity") == null
                        ? 0
                        : (int) productData.get("soldQuantity");

                int addQuantity = item.getQuantity() == null ? 0 : item.getQuantity();

                productData.put("soldQuantity", oldQuantity + addQuantity);
            }
        }

        return productSales.values()
                .stream()
                .sorted((a, b) -> Integer.compare(
                        (int) b.get("soldQuantity"),
                        (int) a.get("soldQuantity")
                ))
                .limit(5)
                .toList();
    }
}