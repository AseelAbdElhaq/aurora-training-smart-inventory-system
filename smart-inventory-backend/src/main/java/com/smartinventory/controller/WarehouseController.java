package com.smartinventory.controller;
import com.smartinventory.model.Warehouse;
import com.smartinventory.repository.WarehouseRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/warehouses")
@CrossOrigin(origins = "http://localhost:4200")
public class WarehouseController {

    private final WarehouseRepository warehouseRepository;

    public WarehouseController(WarehouseRepository warehouseRepository) {
        this.warehouseRepository = warehouseRepository;
    }

    @GetMapping
    public List<Warehouse> getAllWarehouses() {
        return warehouseRepository.findByIsActiveTrue();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Warehouse> getWarehouseById(@PathVariable Integer id) {
        return warehouseRepository.findById(id)
                .filter(warehouse -> Boolean.TRUE.equals(warehouse.getIsActive()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> addWarehouse(@RequestBody Warehouse warehouse) {

        if (warehouse.getWarehouseName() == null || warehouse.getWarehouseName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Warehouse name is required");
        }

        if (warehouse.getCapacity() == null || warehouse.getCapacity() <= 0) {
            return ResponseEntity.badRequest().body("Capacity must be greater than 0");
        }

        if (warehouse.getCurrentCapacity() == null) {
            warehouse.setCurrentCapacity(0);
        }

        if (warehouse.getCurrentCapacity() < 0) {
            return ResponseEntity.badRequest().body("Current capacity cannot be negative");
        }

        if (warehouse.getCurrentCapacity() > warehouse.getCapacity()) {
            return ResponseEntity.badRequest().body("Current capacity cannot be bigger than capacity");
        }

        warehouse.setIsActive(true);

        return ResponseEntity.ok(warehouseRepository.save(warehouse));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateWarehouse(
            @PathVariable Integer id,
            @RequestBody Warehouse updatedWarehouse
    ) {
        return warehouseRepository.findById(id).map(warehouse -> {

            if (updatedWarehouse.getWarehouseName() == null ||
                    updatedWarehouse.getWarehouseName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Warehouse name is required");
            }

            if (updatedWarehouse.getCapacity() == null || updatedWarehouse.getCapacity() <= 0) {
                return ResponseEntity.badRequest().body("Capacity must be greater than 0");
            }

            if (updatedWarehouse.getCurrentCapacity() == null) {
                updatedWarehouse.setCurrentCapacity(0);
            }

            if (updatedWarehouse.getCurrentCapacity() > updatedWarehouse.getCapacity()) {
                return ResponseEntity.badRequest().body("Current capacity cannot be bigger than capacity");
            }

            warehouse.setWarehouseName(updatedWarehouse.getWarehouseName());
            warehouse.setLocation(updatedWarehouse.getLocation());
            warehouse.setCapacity(updatedWarehouse.getCapacity());
            warehouse.setCurrentCapacity(updatedWarehouse.getCurrentCapacity());

            return ResponseEntity.ok(warehouseRepository.save(warehouse));

        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWarehouse(@PathVariable Integer id) {
        return warehouseRepository.findById(id).map(warehouse -> {
            warehouse.setIsActive(false);
            warehouseRepository.save(warehouse);
            return ResponseEntity.ok("Warehouse deleted successfully");
        }).orElse(ResponseEntity.notFound().build());
    }
}