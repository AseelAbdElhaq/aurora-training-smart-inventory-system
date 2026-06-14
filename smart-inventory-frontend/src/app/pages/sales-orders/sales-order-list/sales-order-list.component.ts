import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import {
  SalesOrder,
  SalesOrderService
} from '../../../services/sales-order.service';

type ViewMode = 'CARD' | 'TABLE';

@Component({
  selector: 'app-sales-order-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sales-order-list.component.html',
  styleUrl: './sales-order-list.component.css'
})
export class SalesOrderListComponent implements OnInit {

  orders: SalesOrder[] = [];
  filteredOrders: SalesOrder[] = [];

  userRole = 'ADMIN';

  loading = false;
  errorMessage = '';

  selectedStatus = 'ALL';
  searchText = '';
  viewMode: ViewMode = 'CARD';

  constructor(
    private salesOrderService: SalesOrderService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.userRole =
        (localStorage.getItem('role') || 'ADMIN')
          .trim()
          .toUpperCase()
          .replace('ROLE_', '');

      const savedView = localStorage.getItem('salesOrderViewMode') as ViewMode | null;

      if (savedView === 'CARD' || savedView === 'TABLE') {
        this.viewMode = savedView;
      }
    }
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.salesOrderService.getOrders().subscribe({
      next: orders => {
        this.orders = [...(orders || [])];
        this.applyFilters();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Sales order load error:', error);
        this.errorMessage = 'Failed to load sales orders';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode = mode;

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('salesOrderViewMode', mode);
    }
  }

  applyFilters(): void {
    let result = [...this.orders];

    if (this.selectedStatus !== 'ALL') {
      result = result.filter(order => order.status === this.selectedStatus);
    }

    const keyword = this.searchText.trim().toLowerCase();

    if (keyword) {
      result = result.filter(order =>
        String(order.id || '').includes(keyword) ||
        (order.customerName || '').toLowerCase().includes(keyword) ||
        (order.warehouse?.warehouseName || '').toLowerCase().includes(keyword)
      );
    }

    this.filteredOrders = [...result];
    this.cdr.detectChanges();
  }

  onStatusChange(event: Event): void {
    this.selectedStatus = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  onSearch(event: Event): void {
    this.searchText = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  viewDetails(id?: number): void {
    if (!id) return;
    this.router.navigate(['/sales-orders/details', id]);
  }

  editOrder(id?: number): void {
    if (!id) return;
    this.router.navigate(['/sales-orders/edit', id]);
  }

  completeOrder(id?: number): void {
    if (!id) return;

    if (!confirm('Complete this sales order and decrease stock quantity?')) {
      return;
    }

    this.salesOrderService.completeOrder(id).subscribe({
      next: () => this.loadOrders(),
      error: error => {
        console.error('Complete order error:', error);
        alert(error.error || 'Failed to complete sales order');
        this.cdr.detectChanges();
      }
    });
  }

  cancelOrder(id?: number): void {
    if (!id) return;

    if (!confirm('Cancel this sales order?')) {
      return;
    }

    this.salesOrderService.cancelOrder(id).subscribe({
      next: () => this.loadOrders(),
      error: error => {
        console.error('Cancel order error:', error);
        alert(error.error || 'Failed to cancel sales order');
        this.cdr.detectChanges();
      }
    });
  }

  getStatusClass(status?: string): string {
    if (status === 'COMPLETED') return 'completed';
    if (status === 'CANCELLED') return 'cancelled';
    return 'pending';
  }

  getStatusText(status?: string): string {
    if (status === 'COMPLETED') return 'Completed';
    if (status === 'CANCELLED') return 'Cancelled';
    return 'Pending';
  }

  getItemsCount(order: SalesOrder): number {
    return order.items?.length || 0;
  }

  canAddOrder(): boolean {
    return this.userRole === 'ADMIN' || this.userRole === 'INVENTORY_MANAGER';
  }

  canManageOrder(): boolean {
    return this.userRole === 'ADMIN' || this.userRole === 'INVENTORY_MANAGER';
  }
}