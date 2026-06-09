import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { Warehouse, WarehouseService } from '../../../services/warehouse.service';

type Role =
  | 'ADMIN'
  | 'INVENTORY_MANAGER'
  | 'WAREHOUSE_EMPLOYEE'
  | 'PURCHASING_MANAGER';

@Component({
  selector: 'app-warehouse-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './warehouse-list.component.html',
  styleUrl: './warehouse-list.component.css'
})
export class WarehouseListComponent implements OnInit {
  userRole: Role = 'ADMIN';

  warehouses: Warehouse[] = [];
  loading = false;

  constructor(
    private warehouseService: WarehouseService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.userRole = (localStorage.getItem('role') as Role) || 'ADMIN';
    }
  }

  ngOnInit(): void {
    this.loadWarehouses();
  }

  loadWarehouses(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.warehouseService.getWarehouses().subscribe({
      next: (data) => {
        this.warehouses = Array.isArray(data) ? [...data] : [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('WAREHOUSE ERROR:', error);
        this.warehouses = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getUsedPercentage(warehouse: Warehouse): number {
    if (!warehouse.capacity || warehouse.capacity === 0) {
      return 0;
    }

    return Math.round(
      ((warehouse.currentCapacity || 0) / warehouse.capacity) * 100
    );
  }

  getAvailableCapacity(warehouse: Warehouse): number {
    return warehouse.capacity - (warehouse.currentCapacity || 0);
  }

  deleteWarehouse(id: number | undefined): void {
    if (!id) return;

    const confirmed = confirm('Are you sure you want to delete this warehouse?');

    if (!confirmed) return;

    this.warehouseService.deleteWarehouse(id).subscribe({
      next: () => {
        this.warehouses = this.warehouses.filter(
          warehouse => warehouse.id !== id
        );
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('DELETE WAREHOUSE ERROR:', error);
      }
    });
  }

  canManage(): boolean {
    return this.userRole === 'ADMIN' || this.userRole === 'INVENTORY_MANAGER';
  }

  canDelete(): boolean {
    return this.userRole === 'ADMIN';
  }
}