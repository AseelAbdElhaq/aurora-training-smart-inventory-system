package com.smartinventory.controller;

import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;

import com.smartinventory.model.Stock;
import com.smartinventory.repository.ProductRepository;
import com.smartinventory.repository.WarehouseRepository;
import com.smartinventory.repository.StockRepository;
import com.smartinventory.repository.SupplierRepository;
import com.smartinventory.repository.PurchaseOrderRepository;
import com.smartinventory.repository.SalesOrderRepository;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;
import java.util.List;
@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:4200")
public class ReportController {

    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final StockRepository stockRepository;
    private final SupplierRepository supplierRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final SalesOrderRepository salesOrderRepository;

    public ReportController(
            ProductRepository productRepository,
            WarehouseRepository warehouseRepository,
            StockRepository stockRepository,
            SupplierRepository supplierRepository,
            PurchaseOrderRepository purchaseOrderRepository,
            SalesOrderRepository salesOrderRepository
    ) {
        this.productRepository = productRepository;
        this.warehouseRepository = warehouseRepository;
        this.stockRepository = stockRepository;
        this.supplierRepository = supplierRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.salesOrderRepository = salesOrderRepository;
    }

    @GetMapping("/summary")
    public String summary() {
        return "Reports API is working";
    }

    @GetMapping("/pdf")
    public ResponseEntity<byte[]> exportPdf() throws Exception {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        Document document = new Document();
        PdfWriter.getInstance(document, outputStream);

        document.open();

        Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
        Font normalFont = new Font(Font.HELVETICA, 12);

        document.add(new Paragraph("Smart Inventory System Report", titleFont));
        document.add(new Paragraph(" "));

        document.add(new Paragraph("Total Products: " + productRepository.findByIsDeletedFalse().size(), normalFont));
        document.add(new Paragraph("Total Warehouses: " + warehouseRepository.findByIsActiveTrue().size(), normalFont));
        document.add(new Paragraph("Total Suppliers: " + supplierRepository.findByIsDeletedFalse().size(), normalFont));
        document.add(new Paragraph("Total Purchase Orders: " + purchaseOrderRepository.count(), normalFont));
        document.add(new Paragraph("Total Sales Orders: " + salesOrderRepository.count(), normalFont));
        document.add(new Paragraph(" "));

        document.add(new Paragraph("Stock List", titleFont));
        document.add(new Paragraph(" "));

        for (Stock stock : stockRepository.findByIsDeletedFalse()) {
            String productName = stock.getProduct() == null ? "Unknown Product" : stock.getProduct().getProductName();
            String warehouseName = stock.getWarehouse() == null ? "Unknown Warehouse" : stock.getWarehouse().getWarehouseName();

            document.add(new Paragraph(
                    productName + " | " + warehouseName + " | Qty: " + stock.getQuantity(),
                    normalFont
            ));
        }

        document.close();

        byte[] pdfBytes = outputStream.toByteArray();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(
                ContentDisposition.attachment()
                        .filename("inventory-report.pdf")
                        .build()
        );

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    @GetMapping("/excel")
    public ResponseEntity<byte[]> exportExcel() throws Exception {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Inventory Report");

        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Product");
        header.createCell(1).setCellValue("Warehouse");
        header.createCell(2).setCellValue("Quantity");

        List<Stock> stocks = stockRepository.findByIsDeletedFalse();

        int rowIndex = 1;

        for (Stock stock : stocks) {
            Row row = sheet.createRow(rowIndex++);

            String productName = stock.getProduct() == null ? "Unknown Product" : stock.getProduct().getProductName();
            String warehouseName = stock.getWarehouse() == null ? "Unknown Warehouse" : stock.getWarehouse().getWarehouseName();

            row.createCell(0).setCellValue(productName);
            row.createCell(1).setCellValue(warehouseName);
            row.createCell(2).setCellValue(stock.getQuantity() == null ? 0 : stock.getQuantity());
        }

        sheet.autoSizeColumn(0);
        sheet.autoSizeColumn(1);
        sheet.autoSizeColumn(2);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();

        byte[] excelBytes = outputStream.toByteArray();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(
                MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        );
        headers.setContentDisposition(
                ContentDisposition.attachment()
                        .filename("inventory-report.xlsx")
                        .build()
        );

        return new ResponseEntity<>(excelBytes, headers, HttpStatus.OK);
    }
}