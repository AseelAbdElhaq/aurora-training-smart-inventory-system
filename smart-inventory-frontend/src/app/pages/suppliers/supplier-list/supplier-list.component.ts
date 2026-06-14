import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  Supplier,
  SupplierService
} from '../../../services/supplier.service';

type Role =
  | 'ADMIN'
  | 'INVENTORY_MANAGER'
  | 'WAREHOUSE_EMPLOYEE'
  | 'PURCHASING_MANAGER';

type ViewMode = 'CARD' | 'TABLE';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './supplier-list.component.html',
  styleUrl: './supplier-list.component.css'
})
export class SupplierListComponent implements OnInit {
  userRole: Role = 'ADMIN';

  suppliers: Supplier[] = [];
  loading = false;
  viewMode: ViewMode = 'CARD';

  constructor(
    private supplierService: SupplierService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.userRole =
        ((localStorage.getItem('role') || 'ADMIN')
          .trim()
          .toUpperCase()
          .replace('ROLE_', '') as Role);

      const savedView = localStorage.getItem('supplierViewMode') as ViewMode | null;

      if (savedView === 'CARD' || savedView === 'TABLE') {
        this.viewMode = savedView;
      }
    }
  }

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.supplierService.getSuppliers().subscribe({
      next: data => {
        this.suppliers = Array.isArray(data) ? [...data] : [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('SUPPLIER ERROR:', error);
        this.suppliers = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode = mode;

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('supplierViewMode', mode);
    }
  }

  deleteSupplier(id: number | undefined): void {
    if (!id) return;

    const confirmed = confirm('Are you sure you want to delete this supplier?');

    if (!confirmed) return;

    this.supplierService.deleteSupplier(id).subscribe({
      next: () => {
        this.suppliers = this.suppliers.filter(
          supplier => supplier.id !== id
        );
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('DELETE SUPPLIER ERROR:', error);
        alert(error.error || 'Failed to delete supplier');
      }
    });
  }

  canManage(): boolean {
    return this.userRole === 'ADMIN' || this.userRole === 'PURCHASING_MANAGER';
  }

  canDelete(): boolean {
    return this.userRole === 'ADMIN';
  }
}