import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Product, ProductService } from '../../../services/product.service';
import { Warehouse, WarehouseService } from '../../../services/warehouse.service';
import {
  Stock,
  StockAvailability,
  StockService
} from '../../../services/stock.service';

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

  productLocations: Stock[] = [];
  sourceWarehouses: Warehouse[] = [];
  destinationWarehouses: Warehouse[] = [];

  loading = false;
  errorMessage = '';
  availability: StockAvailability | null = null;

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
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDropdowns();
  }

  loadDropdowns(): void {
    this.loading = true;
    this.errorMessage = '';

    this.productService.getProducts().subscribe({
      next: products => {
        this.products = products.filter(product => !!product.id);
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load products';
        this.cdr.detectChanges();
      }
    });

    this.warehouseService.getWarehouses().subscribe({
      next: warehouses => {
        this.warehouses = warehouses.filter(warehouse => !!warehouse.id);
        this.destinationWarehouses = [...this.warehouses];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load warehouses';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onProductChange(): void {
    this.availability = null;
    this.productLocations = [];
    this.sourceWarehouses = [];
    this.destinationWarehouses = [...this.warehouses];

    this.transferData.sourceWarehouseId = '';
    this.transferData.destinationWarehouseId = '';
    this.transferData.quantity = 0;

    const productId = Number(this.transferData.productId);

    if (!productId) return;

    this.stockService.getProductLocations(productId).subscribe({
      next: stocks => {
        this.productLocations = stocks.filter(stock => Number(stock.quantity || 0) > 0);

        const sourceWarehouseIds = this.productLocations
          .map(stock => Number(stock.warehouse?.id))
          .filter(id => !!id);

        this.sourceWarehouses = this.warehouses.filter(warehouse =>
          sourceWarehouseIds.includes(Number(warehouse.id))
        );

        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load product stock locations';
        this.cdr.detectChanges();
      }
    });
  }

  onWarehouseChange(): void {
    this.availability = null;
    this.errorMessage = '';

    const sourceWarehouseId = Number(this.transferData.sourceWarehouseId);

    this.destinationWarehouses = this.warehouses.filter(warehouse =>
      Number(warehouse.id) !== sourceWarehouseId
    );

    const best = this.getBestDestinationWarehouse();

    if (best?.id) {
      this.transferData.destinationWarehouseId = String(best.id);
    }

    this.loadAvailability();
  }

  loadAvailability(): void {
    this.availability = null;
    this.errorMessage = '';

    const productId = Number(this.transferData.productId);
    const sourceWarehouseId = Number(this.transferData.sourceWarehouseId);
    const destinationWarehouseId = Number(this.transferData.destinationWarehouseId);

    if (!productId || !sourceWarehouseId || !destinationWarehouseId) return;

    this.stockService
      .getAvailability(productId, sourceWarehouseId, destinationWarehouseId)
      .subscribe({
        next: data => {
          this.availability = data;
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorMessage = 'Failed to load stock availability';
          this.cdr.detectChanges();
        }
      });
  }

  getSelectedSourceStock(): number {
    const sourceId = Number(this.transferData.sourceWarehouseId);

    const stock = this.productLocations.find(item =>
      Number(item.warehouse?.id) === sourceId
    );

    return Number(stock?.quantity || 0);
  }

  getBestDestinationWarehouse(): Warehouse | null {
    const sourceId = Number(this.transferData.sourceWarehouseId);

    const availableWarehouses = this.warehouses.filter(warehouse =>
      Number(warehouse.id) !== sourceId
    );

    if (availableWarehouses.length === 0) return null;

    return availableWarehouses.sort((a, b) => {
      const freeA = Number(a.capacity || 0) - Number(a.currentCapacity || 0);
      const freeB = Number(b.capacity || 0) - Number(b.currentCapacity || 0);
      return freeB - freeA;
    })[0];
  }

  getBestDestinationText(): string {
    const best = this.getBestDestinationWarehouse();

    if (!best) return 'No suitable warehouse found';

    const freeSpace = Number(best.capacity || 0) - Number(best.currentCapacity || 0);

    return `${best.warehouseName} has the highest free space (${freeSpace})`;
  }

  getSourceUsage(): number {
    if (!this.availability || !this.availability.sourceTotalCapacity) return 0;

    return Math.round(
      (this.availability.sourceCurrentCapacity / this.availability.sourceTotalCapacity) * 100
    );
  }

  getDestinationUsage(): number {
    if (!this.availability || !this.availability.destinationTotalCapacity) return 0;

    return Math.round(
      (this.availability.destinationCurrentCapacity / this.availability.destinationTotalCapacity) * 100
    );
  }

  hasEnoughStock(): boolean {
    if (!this.transferData.sourceWarehouseId) return true;

    return Number(this.transferData.quantity || 0) <= this.getSelectedSourceStock();
  }

  hasEnoughCapacity(): boolean {
    if (!this.availability) return true;

    return Number(this.transferData.quantity || 0) <= this.availability.destinationFreeSpace;
  }

  transferStock(): void {
    this.errorMessage = '';

    if (!this.transferData.productId) {
      this.errorMessage = 'Please select a product';
      return;
    }

    if (!this.transferData.sourceWarehouseId) {
      this.errorMessage = 'Please select source warehouse';
      return;
    }

    if (!this.transferData.destinationWarehouseId) {
      this.errorMessage = 'Please select destination warehouse';
      return;
    }

    if (this.transferData.quantity <= 0) {
      this.errorMessage = 'Quantity must be greater than 0';
      return;
    }

    if (!this.hasEnoughStock()) {
      this.errorMessage = 'Not enough stock in source warehouse';
      return;
    }

    if (!this.hasEnoughCapacity()) {
      this.errorMessage = 'Destination warehouse does not have enough capacity';
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
      error: error => {
        this.errorMessage = error?.error || 'Transfer failed';
      }
    });
  }
}