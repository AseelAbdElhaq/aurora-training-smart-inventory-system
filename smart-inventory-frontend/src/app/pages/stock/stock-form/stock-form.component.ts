import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
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

  loading = false;
  errorMessage = '';

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
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDropdownData();

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEdit = true;
      this.stockId = Number(id);
      this.loadStock(this.stockId);
    }
  }

  loadDropdownData(): void {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products.filter(product => !!product.id);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('PRODUCT DROPDOWN ERROR:', error);
        this.errorMessage = 'Failed to load products';
        this.cdr.detectChanges();
      }
    });

    this.warehouseService.getWarehouses().subscribe({
      next: (warehouses) => {
        this.warehouses = warehouses.filter(warehouse => !!warehouse.id);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('WAREHOUSE DROPDOWN ERROR:', error);
        this.errorMessage = 'Failed to load warehouses';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadStock(id: number): void {
    this.stockService.getStockById(id).subscribe({
      next: (stock) => {
        this.formData = {
          productId: stock.product?.id ? String(stock.product.id) : '',
          warehouseId: stock.warehouse?.id ? String(stock.warehouse.id) : '',
          quantity: Number(stock.quantity || 0)
        };

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('STOCK LOAD ERROR:', error);
        this.errorMessage = 'Failed to load stock';
        this.cdr.detectChanges();
      }
    });
  }

  saveStock(): void {
    this.errorMessage = '';

    if (!this.formData.productId) {
      this.errorMessage = 'Please select a product';
      return;
    }

    if (!this.formData.warehouseId) {
      this.errorMessage = 'Please select a warehouse';
      return;
    }

    if (this.formData.quantity <= 0) {
      this.errorMessage = 'Quantity must be greater than 0';
      return;
    }

    const stockData = {
      productId: Number(this.formData.productId),
      warehouseId: Number(this.formData.warehouseId),
      quantity: Number(this.formData.quantity)
    };

    if (this.isEdit) {
      this.stockService.updateStock(this.stockId, stockData).subscribe({
        next: () => this.router.navigate(['/stock']),
        error: (error) => {
          console.error('STOCK UPDATE ERROR:', error);
          this.errorMessage = 'Failed to update stock';
        }
      });

      return;
    }

    this.stockService.createStock(stockData).subscribe({
      next: () => this.router.navigate(['/stock']),
      error: (error) => {
        console.error('STOCK ADD ERROR:', error);
        this.errorMessage = error?.error || 'Failed to save stock';
      }
    });
  }
}