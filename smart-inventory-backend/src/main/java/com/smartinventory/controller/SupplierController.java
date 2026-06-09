package com.smartinventory.controller;

import com.smartinventory.model.Supplier;
import com.smartinventory.repository.SupplierRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "http://localhost:4200")
public class SupplierController {

    private final SupplierRepository supplierRepository;

    public SupplierController(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    @GetMapping
    public List<Supplier> getSuppliers() {
        return supplierRepository.findByIsDeletedFalse();
    }

    @GetMapping("/{id}")
    public Supplier getSupplierById(@PathVariable Integer id) {
        return supplierRepository.findById(id).orElseThrow();
    }

    @PostMapping
    public Supplier addSupplier(@RequestBody Supplier supplier) {
        supplier.setIsDeleted(false);
        return supplierRepository.save(supplier);
    }

    @PutMapping("/{id}")
    public Supplier updateSupplier(
            @PathVariable Integer id,
            @RequestBody Supplier supplierData
    ) {
        Supplier supplier = supplierRepository.findById(id).orElseThrow();

        supplier.setSupplierName(supplierData.getSupplierName());
        supplier.setContactPerson(supplierData.getContactPerson());
        supplier.setEmail(supplierData.getEmail());
        supplier.setPhone(supplierData.getPhone());
        supplier.setAddress(supplierData.getAddress());

        return supplierRepository.save(supplier);
    }

    @DeleteMapping("/{id}")
    public void deleteSupplier(@PathVariable Integer id) {
        Supplier supplier = supplierRepository.findById(id).orElseThrow();

        supplier.setIsDeleted(true);

        supplierRepository.save(supplier);
    }
}