import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { Stock, StockService } from '../../../services/stock.service';

type Role =
  | 'ADMIN'
  | 'INVENTORY_MANAGER'
  | 'WAREHOUSE_EMPLOYEE'
  | 'PURCHASING_MANAGER';

type ViewMode = 'CARD' | 'TABLE';

@Component({
  selector: 'app-stock-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './stock-list.component.html',
  styleUrl: './stock-list.component.css'
})
export class StockListComponent implements OnInit {
  userRole: Role = 'ADMIN';

  stocks: Stock[] = [];
  loading = false;
  viewMode: ViewMode = 'CARD';

  constructor(
    private stockService: StockService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.userRole =
        ((localStorage.getItem('role') || 'ADMIN')
          .trim()
          .toUpperCase()
          .replace('ROLE_', '') as Role);

      const savedView = localStorage.getItem('stockViewMode') as ViewMode | null;

      if (savedView === 'CARD' || savedView === 'TABLE') {
        this.viewMode = savedView;
      }
    }
  }

  ngOnInit(): void {
    this.loadStocks();
  }

  loadStocks(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.stockService.getAllStocks().subscribe({
      next: data => {
        this.stocks = Array.isArray(data) ? [...data] : [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('STOCK LOAD ERROR:', error);
        this.stocks = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode = mode;

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('stockViewMode', mode);
    }
  }

  deleteStock(id: number | undefined): void {
    if (!id) return;

    const confirmed = confirm('Are you sure you want to archive this stock record?');
    if (!confirmed) return;

    this.stockService.deleteStock(id).subscribe({
      next: () => {
        this.stocks = this.stocks.filter(stock => stock.id !== id);
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('STOCK DELETE ERROR:', error);
        alert('Failed to delete stock');
      }
    });
  }

  getStockStatus(quantity: number | undefined): string {
    const qty = Number(quantity || 0);

    if (qty <= 5) return 'Low Stock';
    if (qty <= 20) return 'Medium Stock';

    return 'Healthy Stock';
  }

  canAddStock(): boolean {
    return (
      this.userRole === 'ADMIN' ||
      this.userRole === 'INVENTORY_MANAGER' ||
      this.userRole === 'WAREHOUSE_EMPLOYEE'
    );
  }

  canEditStock(): boolean {
    return (
      this.userRole === 'ADMIN' ||
      this.userRole === 'INVENTORY_MANAGER' ||
      this.userRole === 'WAREHOUSE_EMPLOYEE'
    );
  }

  canDeleteStock(): boolean {
    return this.userRole === 'ADMIN' || this.userRole === 'INVENTORY_MANAGER';
  }

  canTransferStock(): boolean {
    return this.userRole === 'ADMIN' || this.userRole === 'INVENTORY_MANAGER';
  }
}