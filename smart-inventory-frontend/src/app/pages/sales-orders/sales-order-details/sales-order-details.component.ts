import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import {
  SalesOrder,
  SalesOrderService
} from '../../../services/sales-order.service';

@Component({
  selector: 'app-sales-order-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sales-order-details.component.html',
  styleUrl: './sales-order-details.component.css'
})
export class SalesOrderDetailsComponent implements OnInit {

  order: SalesOrder | null = null;

  loading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private salesOrderService: SalesOrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.router.navigate(['/sales-orders']);
      return;
    }

    this.loadOrder(id);
  }

  loadOrder(id: number): void {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.salesOrderService.getOrderById(id).subscribe({
      next: order => {
        this.order = order;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Sales order details error:', error);
        this.errorMessage = 'Failed to load sales order';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getItemTotal(quantity?: number, price?: number): number {
    return (Number(quantity) || 0) * (Number(price) || 0);
  }

  getStatusClass(status?: string): string {
    if (status === 'COMPLETED') return 'completed';
    if (status === 'CANCELLED') return 'cancelled';
    return 'pending';
  }
}