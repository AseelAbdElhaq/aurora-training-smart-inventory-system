package com.smartinventory.controller;

import com.smartinventory.model.Product;
import com.smartinventory.model.Stock;
import com.smartinventory.model.Warehouse;
import com.smartinventory.repository.ProductRepository;
import com.smartinventory.repository.StockRepository;
import com.smartinventory.repository.WarehouseRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
@CrossOrigin(origins = "http://localhost:4200")
public class StockController {

    private final StockRepository stockRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;

    public StockController(
            StockRepository stockRepository,
            ProductRepository productRepository,
            WarehouseRepository warehouseRepository
    ) {
        this.stockRepository = stockRepository;
        this.productRepository = productRepository;
        this.warehouseRepository = warehouseRepository;
    }

    @GetMapping
    public List<Stock> getAllStocks() {
        return stockRepository.findByIsDeletedFalse();
    }

    @GetMapping("/{id}")
    public Stock getStockById(@PathVariable Integer id) {
        return stockRepository.findById(id).orElseThrow();
    }

    @GetMapping("/product-locations/{productId}")
    public List<Stock> getProductLocations(@PathVariable Integer productId) {
        return stockRepository.findByProductIdAndIsDeletedFalse(productId);
    }

    @GetMapping("/availability")
    public StockAvailability getAvailability(
            @RequestParam Integer productId,
            @RequestParam Integer sourceWarehouseId,
            @RequestParam Integer destinationWarehouseId
    ) {
        Stock sourceStock = stockRepository
                .findByProductIdAndWarehouseIdAndIsDeletedFalse(productId, sourceWarehouseId)
                .orElse(null);

        Warehouse sourceWarehouse = warehouseRepository.findById(sourceWarehouseId).orElseThrow();
        Warehouse destinationWarehouse = warehouseRepository.findById(destinationWarehouseId).orElseThrow();

        StockAvailability result = new StockAvailability();

        result.availableQuantity = sourceStock == null ? 0 : sourceStock.getQuantity();

        result.sourceWarehouseName = sourceWarehouse.getWarehouseName();
        result.sourceCurrentCapacity = sourceWarehouse.getCurrentCapacity();
        result.sourceTotalCapacity = sourceWarehouse.getCapacity();
        result.sourceFreeSpace = sourceWarehouse.getCapacity() - sourceWarehouse.getCurrentCapacity();

        result.destinationWarehouseName = destinationWarehouse.getWarehouseName();
        result.destinationCurrentCapacity = destinationWarehouse.getCurrentCapacity();
        result.destinationTotalCapacity = destinationWarehouse.getCapacity();
        result.destinationFreeSpace = destinationWarehouse.getCapacity() - destinationWarehouse.getCurrentCapacity();

        return result;
    }

    @PostMapping
    public Stock createStock(@RequestBody StockRequest request) {
        Product product = productRepository.findById(request.productId).orElseThrow();
        Warehouse warehouse = warehouseRepository.findById(request.warehouseId).orElseThrow();

        Stock stock = new Stock();
        stock.setProduct(product);
        stock.setWarehouse(warehouse);
        stock.setQuantity(request.quantity);
        stock.setIsDeleted(false);

        warehouse.setCurrentCapacity(warehouse.getCurrentCapacity() + request.quantity);
        warehouseRepository.save(warehouse);

        return stockRepository.save(stock);
    }

    @PutMapping("/{id}")
    public Stock updateStock(@PathVariable Integer id, @RequestBody StockRequest request) {
        Stock stock = stockRepository.findById(id).orElseThrow();

        Warehouse oldWarehouse = stock.getWarehouse();
        oldWarehouse.setCurrentCapacity(oldWarehouse.getCurrentCapacity() - stock.getQuantity());

        Product product = productRepository.findById(request.productId).orElseThrow();
        Warehouse newWarehouse = warehouseRepository.findById(request.warehouseId).orElseThrow();

        newWarehouse.setCurrentCapacity(newWarehouse.getCurrentCapacity() + request.quantity);

        warehouseRepository.save(oldWarehouse);
        warehouseRepository.save(newWarehouse);

        stock.setProduct(product);
        stock.setWarehouse(newWarehouse);
        stock.setQuantity(request.quantity);
        stock.setIsDeleted(false);

        return stockRepository.save(stock);
    }

    @DeleteMapping("/{id}")
    public void deleteStock(@PathVariable Integer id) {
        Stock stock = stockRepository.findById(id).orElseThrow();

        Warehouse warehouse = stock.getWarehouse();
        warehouse.setCurrentCapacity(warehouse.getCurrentCapacity() - stock.getQuantity());

        warehouseRepository.save(warehouse);

        stock.setIsDeleted(true);
        stockRepository.save(stock);
    }

    @PostMapping("/transfer")
    public String transferStock(@RequestBody TransferRequest request) {
        Stock sourceStock = stockRepository
                .findByProductIdAndWarehouseIdAndIsDeletedFalse(
                        request.productId,
                        request.sourceWarehouseId
                )
                .orElseThrow();

        if (sourceStock.getQuantity() < request.quantity) {
            throw new RuntimeException("Not enough stock in source warehouse");
        }

        Warehouse sourceWarehouse = warehouseRepository
                .findById(request.sourceWarehouseId)
                .orElseThrow();

        Warehouse destinationWarehouse = warehouseRepository
                .findById(request.destinationWarehouseId)
                .orElseThrow();

        if (destinationWarehouse.getCurrentCapacity() + request.quantity > destinationWarehouse.getCapacity()) {
            throw new RuntimeException("Destination warehouse does not have enough capacity");
        }

        Stock destinationStock = stockRepository
                .findByProductIdAndWarehouseIdAndIsDeletedFalse(
                        request.productId,
                        request.destinationWarehouseId
                )
                .orElse(null);

        if (destinationStock == null) {
            Product product = productRepository.findById(request.productId).orElseThrow();

            destinationStock = new Stock();
            destinationStock.setProduct(product);
            destinationStock.setWarehouse(destinationWarehouse);
            destinationStock.setQuantity(0);
            destinationStock.setIsDeleted(false);
        }

        sourceStock.setQuantity(sourceStock.getQuantity() - request.quantity);
        destinationStock.setQuantity(destinationStock.getQuantity() + request.quantity);

        sourceWarehouse.setCurrentCapacity(sourceWarehouse.getCurrentCapacity() - request.quantity);
        destinationWarehouse.setCurrentCapacity(destinationWarehouse.getCurrentCapacity() + request.quantity);

        stockRepository.save(sourceStock);
        stockRepository.save(destinationStock);

        warehouseRepository.save(sourceWarehouse);
        warehouseRepository.save(destinationWarehouse);

        return "Stock transferred successfully";
    }

    public static class StockRequest {
        public Integer productId;
        public Integer warehouseId;
        public Integer quantity;
    }

    public static class TransferRequest {
        public Integer productId;
        public Integer sourceWarehouseId;
        public Integer destinationWarehouseId;
        public Integer quantity;
        public String notes;
    }

    public static class StockAvailability {
        public Integer availableQuantity;

        public String sourceWarehouseName;
        public Integer sourceCurrentCapacity;
        public Integer sourceTotalCapacity;
        public Integer sourceFreeSpace;

        public String destinationWarehouseName;
        public Integer destinationCurrentCapacity;
        public Integer destinationTotalCapacity;
        public Integer destinationFreeSpace;
    }
}