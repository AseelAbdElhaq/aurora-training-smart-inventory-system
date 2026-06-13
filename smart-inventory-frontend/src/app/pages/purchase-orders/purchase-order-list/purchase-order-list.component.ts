import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import {
  PurchaseOrder,
  PurchaseOrderService
} from '../../../services/purchase-order.service';

@Component({
  selector: 'app-purchase-order-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './purchase-order-list.component.html',
  styleUrl: './purchase-order-list.component.css'
})
export class PurchaseOrderListComponent implements OnInit {

  orders: PurchaseOrder[] = [];
  filteredOrders: PurchaseOrder[] = [];

  loading = false;
  errorMessage = '';

  selectedStatus = 'ALL';
  searchText = '';

  constructor(
    private purchaseOrderService: PurchaseOrderService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.purchaseOrderService.getOrders().subscribe({
      next: (orders) => {
        this.orders = [...(orders || [])];
        this.applyFilters();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Purchase orders load error:', error);
        this.errorMessage = 'Failed to load purchase orders';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
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
        (order.supplier?.supplierName || '').toLowerCase().includes(keyword) ||
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

  editOrder(id?: number): void {
    if (!id) return;
    this.router.navigate(['/purchase-orders/edit', id]);
  }

  receiveOrder(id?: number): void {
    if (!id) return;

    if (!confirm('Receive this purchase order and update stock?')) {
      return;
    }

    this.purchaseOrderService.receiveOrder(id).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (error) => {
        console.error('Receive order error:', error);
        alert(error.error || 'Failed to receive purchase order');
        this.cdr.detectChanges();
      }
    });
  }

  cancelOrder(id?: number): void {
    if (!id) return;

    if (!confirm('Cancel this purchase order?')) {
      return;
    }

    this.purchaseOrderService.cancelOrder(id).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (error) => {
        console.error('Cancel order error:', error);
        alert(error.error || 'Failed to cancel purchase order');
        this.cdr.detectChanges();
      }
    });
  }

  getStatusClass(status?: string): string {
    if (status === 'RECEIVED') return 'received';
    if (status === 'CANCELLED') return 'cancelled';
    return 'pending';
  }

  getStatusText(status?: string): string {
    if (status === 'RECEIVED') return 'Received';
    if (status === 'CANCELLED') return 'Cancelled';
    return 'Pending';
  }

  getItemsCount(order: PurchaseOrder): number {
    return order.items?.length || 0;
  }
}