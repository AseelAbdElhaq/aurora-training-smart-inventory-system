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

type ViewMode = 'CARD' | 'TABLE';

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
  viewMode: ViewMode = 'CARD';

  constructor(
    private warehouseService: WarehouseService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.userRole =
        ((localStorage.getItem('role') || 'ADMIN')
          .trim()
          .toUpperCase()
          .replace('ROLE_', '') as Role);

      const savedView = localStorage.getItem('warehouseViewMode') as ViewMode | null;

      if (savedView === 'CARD' || savedView === 'TABLE') {
        this.viewMode = savedView;
      }
    }
  }

  ngOnInit(): void {
    this.loadWarehouses();
  }

  loadWarehouses(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.warehouseService.getWarehouses().subscribe({
      next: data => {
        this.warehouses = Array.isArray(data) ? [...data] : [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('WAREHOUSE ERROR:', error);
        this.warehouses = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode = mode;

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('warehouseViewMode', mode);
    }
  }

  getUsedPercentage(warehouse: Warehouse): number {
    if (!warehouse.capacity || warehouse.capacity === 0) {
      return 0;
    }

    const used = Math.round(
      ((warehouse.currentCapacity || 0) / warehouse.capacity) * 100
    );

    return Math.min(100, Math.max(0, used));
  }

  getAvailableCapacity(warehouse: Warehouse): number {
    return Math.max(
      0,
      Number(warehouse.capacity || 0) - Number(warehouse.currentCapacity || 0)
    );
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
      error: error => {
        console.error('DELETE WAREHOUSE ERROR:', error);
        alert(error.error || 'Failed to delete warehouse');
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