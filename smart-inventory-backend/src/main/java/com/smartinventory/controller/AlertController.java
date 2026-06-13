package com.smartinventory.controller;

import com.smartinventory.model.Alert;
import com.smartinventory.model.Stock;
import com.smartinventory.model.Warehouse;
import com.smartinventory.repository.AlertRepository;
import com.smartinventory.repository.StockRepository;
import com.smartinventory.repository.WarehouseRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "http://localhost:4200")
public class AlertController {

    private final AlertRepository alertRepository;
    private final StockRepository stockRepository;
    private final WarehouseRepository warehouseRepository;

    public AlertController(
            AlertRepository alertRepository,
            StockRepository stockRepository,
            WarehouseRepository warehouseRepository
    ) {
        this.alertRepository = alertRepository;
        this.stockRepository = stockRepository;
        this.warehouseRepository = warehouseRepository;
    }

    @GetMapping
    public List<Alert> getAlerts() {
        return alertRepository.findAll();
    }

    @PostMapping("/generate")
    public List<Alert> generateAlerts() {

        for (Stock stock : stockRepository.findByIsDeletedFalse()) {
            int quantity = stock.getQuantity() == null ? 0 : stock.getQuantity();

            if (quantity <= 5) {
                Alert alert = new Alert();
                alert.setAlertType(quantity == 0 ? "OUT_OF_STOCK" : "LOW_STOCK");

                String productName = stock.getProduct() == null
                        ? "Product"
                        : stock.getProduct().getProductName();

                alert.setMessage(productName + " has low stock quantity: " + quantity);
                alertRepository.save(alert);
            }
        }

        for (Warehouse warehouse : warehouseRepository.findByIsActiveTrue()) {
            int capacity = warehouse.getCapacity() == null ? 0 : warehouse.getCapacity();
            int used = warehouse.getCurrentCapacity() == null ? 0 : warehouse.getCurrentCapacity();

            if (capacity > 0 && used * 100.0 / capacity >= 85) {
                Alert alert = new Alert();
                alert.setAlertType("WAREHOUSE_CAPACITY");
                alert.setMessage(
                        warehouse.getWarehouseName()
                                + " is almost full: "
                                + Math.round(used * 100.0 / capacity)
                                + "% used"
                );

                alertRepository.save(alert);
            }
        }

        return alertRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAlert(@PathVariable Integer id) {
        if (!alertRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        alertRepository.deleteById(id);
        return ResponseEntity.ok("Alert deleted successfully");
    }
}