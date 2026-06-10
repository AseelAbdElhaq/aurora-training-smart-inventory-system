import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import {
  Product,
  ProductService
} from '../../../services/product.service';

import {
  Warehouse,
  WarehouseService
} from '../../../services/warehouse.service';

import { StockService } from '../../../services/stock.service';

@Component({
  selector: 'app-stock-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-form.component.html',
  styleUrl: './stock-form.component.css'
})
export class StockFormComponent implements OnInit {

  isEdit = false;

  stockId = 0;

  products: Product[] = [];
  warehouses: Warehouse[] = [];

  formData = {
    productId: '',
    warehouseId: '',
    quantity: 0
  };

  constructor(
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private stockService: StockService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.loadProducts();
    this.loadWarehouses();

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEdit = true;
      this.stockId = +id;

      this.stockService.getStockById(this.stockId)
        .subscribe(stock => {

          this.formData = {
            productId: stock.product?.id,
            warehouseId: stock.warehouse?.id,
            quantity: stock.quantity
          };
        });
    }
  }

  loadProducts(): void {
    this.productService.getProducts()
      .subscribe(products => {
        this.products = products;
      });
  }

  loadWarehouses(): void {
    this.warehouseService.getWarehouses()
      .subscribe(warehouses => {
        this.warehouses = warehouses;
      });
  }

  saveStock(): void {

    if (
      !this.formData.productId ||
      !this.formData.warehouseId ||
      this.formData.quantity < 0
    ) {
      return;
    }

    const stockData = {
      productId: Number(this.formData.productId),
      warehouseId: Number(this.formData.warehouseId),
      quantity: Number(this.formData.quantity)
    };

    if (this.isEdit) {

      this.stockService
        .updateStock(this.stockId, stockData)
        .subscribe(() => {
          this.router.navigate(['/stock']);
        });

    } else {

      this.stockService
        .createStock(stockData)
        .subscribe(() => {
          this.router.navigate(['/stock']);
        });
    }
  }
}