import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Product, ProductService } from '../../../services/product.service';
import { Warehouse, WarehouseService } from '../../../services/warehouse.service';
import { StockService } from '../../../services/stock.service';

@Component({
  selector: 'app-stock-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-transfer.component.html',
  styleUrl: './stock-transfer.component.css'
})
export class StockTransferComponent implements OnInit {
  products: Product[] = [];
  warehouses: Warehouse[] = [];

  transferData = {
    productId: '',
    sourceWarehouseId: '',
    destinationWarehouseId: '',
    quantity: 0,
    notes: ''
  };

  constructor(
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private stockService: StockService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
    });

    this.warehouseService.getWarehouses().subscribe(data => {
      this.warehouses = data;
    });
  }

  transferStock(): void {
    if (
      !this.transferData.productId ||
      !this.transferData.sourceWarehouseId ||
      !this.transferData.destinationWarehouseId ||
      this.transferData.quantity <= 0
    ) {
      alert('Please fill all required fields');
      return;
    }

    if (this.transferData.sourceWarehouseId === this.transferData.destinationWarehouseId) {
      alert('Source and destination warehouse cannot be the same');
      return;
    }

    const request = {
      productId: Number(this.transferData.productId),
      sourceWarehouseId: Number(this.transferData.sourceWarehouseId),
      destinationWarehouseId: Number(this.transferData.destinationWarehouseId),
      quantity: Number(this.transferData.quantity),
      notes: this.transferData.notes
    };

    this.stockService.transferStock(request).subscribe({
      next: () => {
        alert('Stock transferred successfully');
        this.router.navigate(['/stock']);
      },
      error: (err) => {
        alert(err.error || 'Transfer failed');
      }
    });
  }
}