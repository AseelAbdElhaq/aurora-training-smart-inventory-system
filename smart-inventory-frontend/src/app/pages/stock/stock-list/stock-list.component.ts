import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { StockService } from '../../../services/stock.service';

type Role =
  | 'ADMIN'
  | 'INVENTORY_MANAGER'
  | 'WAREHOUSE_EMPLOYEE'
  | 'EMPLOYEE'
  | 'PURCHASING_MANAGER';

@Component({
  selector: 'app-stock-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './stock-list.component.html',
  styleUrl: './stock-list.component.css'
})
export class StockListComponent implements OnInit {

  stocks: any[] = [];

  loading = true;

  userRole: Role = 'ADMIN';

  constructor(
    private stockService: StockService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userRole = (localStorage.getItem('role') as Role) || 'ADMIN';
    this.loadStocks();
  }

  canAddStock(): boolean {
    return (
      this.userRole === 'ADMIN' ||
      this.userRole === 'INVENTORY_MANAGER' ||
      this.userRole === 'WAREHOUSE_EMPLOYEE' ||
      this.userRole === 'EMPLOYEE'
    );
  }

  canTransferStock(): boolean {
    return this.userRole === 'ADMIN' || this.userRole === 'INVENTORY_MANAGER';
  }

  canEditStock(): boolean {
    return (
      this.userRole === 'ADMIN' ||
      this.userRole === 'INVENTORY_MANAGER' ||
      this.userRole === 'WAREHOUSE_EMPLOYEE' ||
      this.userRole === 'EMPLOYEE'
    );
  }

  canDeleteStock(): boolean {
    return this.userRole === 'ADMIN' || this.userRole === 'INVENTORY_MANAGER';
  }

  loadStocks(): void {
    this.loading = true;

    this.stockService.getAllStocks().subscribe({
      next: (data) => {
        this.stocks = data;
        this.loading = false;
      },

      error: () => {
        this.loading = false;
      }
    });
  }

  deleteStock(id: number): void {

    if (!this.canDeleteStock()) {
      alert('Access denied. You are not allowed to delete stock.');
      return;
    }

    const confirmed = confirm(
      'Are you sure you want to delete this stock?'
    );

    if (!confirmed) {
      return;
    }

    this.stockService.deleteStock(id).subscribe(() => {
      this.loadStocks();
    });
  }
}