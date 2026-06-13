package com.smartinventory.controller;

import com.smartinventory.model.Stock;
import com.smartinventory.model.Warehouse;
import com.smartinventory.repository.StockRepository;
import com.smartinventory.repository.WarehouseRepository;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/ai-insights")
@CrossOrigin(origins = "http://localhost:4200")
public class AiInsightController {

    private final StockRepository stockRepository;
    private final WarehouseRepository warehouseRepository;

    public AiInsightController(
            StockRepository stockRepository,
            WarehouseRepository warehouseRepository
    ) {
        this.stockRepository = stockRepository;
        this.warehouseRepository = warehouseRepository;
    }

    @GetMapping
    public List<Map<String, Object>> getInsights() {
        List<Map<String, Object>> insights = new ArrayList<>();

        for (Stock stock : stockRepository.findByIsDeletedFalse()) {
            int quantity = stock.getQuantity() == null ? 0 : stock.getQuantity();

            if (quantity <= 5) {
                Map<String, Object> item = new HashMap<>();

                String productName = stock.getProduct() == null
                        ? "Product"
                        : stock.getProduct().getProductName();

                item.put("type", "LOW_STOCK");
                item.put("title", "Low Stock Prediction");
                item.put("message", productName + " may run out soon. Current quantity: " + quantity);
                item.put("recommendation", "Create a purchase order or transfer stock from another warehouse.");

                insights.add(item);
            }
        }

        for (Warehouse warehouse : warehouseRepository.findByIsActiveTrue()) {
            int capacity = warehouse.getCapacity() == null ? 0 : warehouse.getCapacity();
            int used = warehouse.getCurrentCapacity() == null ? 0 : warehouse.getCurrentCapacity();

            if (capacity > 0) {
                double percentage = used * 100.0 / capacity;

                if (percentage >= 85) {
                    Map<String, Object> item = new HashMap<>();

                    item.put("type", "WAREHOUSE_CAPACITY");
                    item.put("title", "Warehouse Almost Full");
                    item.put("message", warehouse.getWarehouseName() + " is " + Math.round(percentage) + "% full.");
                    item.put("recommendation", findBetterWarehouse(warehouse, capacity - used));

                    insights.add(item);
                }
            }
        }

        if (insights.isEmpty()) {
            Map<String, Object> item = new HashMap<>();
            item.put("type", "NORMAL");
            item.put("title", "System Stable");
            item.put("message", "No critical stock or warehouse issues detected.");
            item.put("recommendation", "Keep monitoring stock and warehouse capacity.");
            insights.add(item);
        }

        return insights;
    }

    private String findBetterWarehouse(Warehouse currentWarehouse, int neededSpace) {
        for (Warehouse warehouse : warehouseRepository.findByIsActiveTrue()) {
            if (warehouse.getId().equals(currentWarehouse.getId())) {
                continue;
            }

            int capacity = warehouse.getCapacity() == null ? 0 : warehouse.getCapacity();
            int used = warehouse.getCurrentCapacity() == null ? 0 : warehouse.getCurrentCapacity();
            int available = capacity - used;

            if (available > neededSpace) {
                return "Suggested warehouse: " + warehouse.getWarehouseName()
                        + " because it has " + available + " free capacity.";
            }
        }

        return "No better warehouse found. Consider increasing capacity or reducing incoming stock.";
    }
}