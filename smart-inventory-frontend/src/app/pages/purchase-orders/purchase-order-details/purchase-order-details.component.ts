import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import {
  PurchaseOrder,
  PurchaseOrderService
} from '../../../services/purchase-order.service';

@Component({
  selector: 'app-purchase-order-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './purchase-order-details.component.html',
  styleUrl: './purchase-order-details.component.css'
})
export class PurchaseOrderDetailsComponent implements OnInit {

  order: PurchaseOrder | null = null;

  loading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private purchaseOrderService: PurchaseOrderService
  ) {}

  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!id) {
      this.router.navigate(['/purchase-orders']);
      return;
    }

    this.loadOrder(id);
  }

  loadOrder(id: number): void {

    this.loading = true;

    this.purchaseOrderService.getOrderById(id).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load purchase order';
        this.loading = false;
      }
    });
  }

  getItemTotal(quantity?: number, price?: number): number {
    return (quantity || 0) * (price || 0);
  }

  getStatusClass(status?: string): string {

    if (status === 'RECEIVED') {
      return 'received';
    }

    if (status === 'CANCELLED') {
      return 'cancelled';
    }

    return 'pending';
  }
}