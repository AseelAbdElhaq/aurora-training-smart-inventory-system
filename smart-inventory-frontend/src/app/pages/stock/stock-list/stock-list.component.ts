import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { StockService } from '../../../services/stock.service';

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

  constructor(
    private stockService: StockService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStocks();
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