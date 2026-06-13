import {
  Component,
  Inject,
  PLATFORM_ID,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import { RouterLink } from '@angular/router';

import { StatCardComponent } from '../../shared/stat-card/stat-card';

import {
  DashboardService,
  DashboardSummary,
  RecentActivity,
  TopProduct
} from '../../services/dashboard.service';

import {
  AiInsight,
  AiInsightService
} from '../../services/ai-insight.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, StatCardComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  username = 'Admin';

  loading = false;

  currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  cards = [
    {
      title: 'Products',
      value: '0',
      icon: 'inventory_2',
      change: 'Real data',
      status: 'up'
    },
    {
      title: 'Warehouses',
      value: '0',
      icon: 'warehouse',
      change: 'Real data',
      status: 'up'
    },
    {
      title: 'Stock Units',
      value: '0',
      icon: 'layers',
      change: 'Real data',
      status: 'up'
    },
    {
      title: 'Low Stock Alerts',
      value: '0',
      icon: 'warning',
      change: 'Real data',
      status: 'down'
    }
  ];

  activities: RecentActivity[] = [];
  bestProducts: TopProduct[] = [];
  aiInsights: AiInsight[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private dashboardService: DashboardService,
    private aiInsightService: AiInsightService,
    private cdr: ChangeDetectorRef
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.username = localStorage.getItem('username') || 'Admin';
    }
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.loadSummary();
    this.loadRecentActivities();
    this.loadTopProducts();
    this.loadAiInsights();

    this.loading = false;
    this.cdr.detectChanges();
  }

  loadSummary(): void {
    this.dashboardService.getSummary().subscribe({
      next: (summary: DashboardSummary) => {
        this.cards = [
          {
            title: 'Products',
            value: String(summary.totalProducts || 0),
            icon: 'inventory_2',
            change: 'From database',
            status: 'up'
          },
          {
            title: 'Warehouses',
            value: String(summary.totalWarehouses || 0),
            icon: 'warehouse',
            change: 'Active warehouses',
            status: 'up'
          },
          {
            title: 'Stock Units',
            value: this.formatNumber(summary.totalStock || 0),
            icon: 'layers',
            change: 'Current stock',
            status: 'up'
          },
          {
            title: 'Low Stock Alerts',
            value: String(summary.lowStockAlerts || 0),
            icon: 'warning',
            change: 'Qty ≤ 5',
            status: summary.lowStockAlerts > 0 ? 'down' : 'up'
          }
        ];

        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Dashboard summary error:', error);
      }
    });
  }

  loadRecentActivities(): void {
    this.dashboardService.getRecentActivities().subscribe({
      next: data => {
        this.activities = [...(data || [])];
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Recent activities error:', error);
        this.activities = [];
        this.cdr.detectChanges();
      }
    });
  }

  loadTopProducts(): void {
    this.dashboardService.getTopProducts().subscribe({
      next: data => {
        this.bestProducts = [...(data || [])];
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Top products error:', error);
        this.bestProducts = [];
        this.cdr.detectChanges();
      }
    });
  }

  loadAiInsights(): void {
    this.aiInsightService.getInsights().subscribe({
      next: data => {
        this.aiInsights = [...(data || [])];
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('AI insights error:', error);
        this.aiInsights = [];
        this.cdr.detectChanges();
      }
    });
  }

  getMainAiInsight(): AiInsight | null {
    return this.aiInsights.length > 0 ? this.aiInsights[0] : null;
  }

  getActivityIcon(type?: string): string {
    const value = (type || '').toUpperCase();

    if (value.includes('ADD')) return 'add_box';
    if (value.includes('REMOVE')) return 'remove_circle';
    if (value.includes('TRANSFER')) return 'swap_horiz';
    if (value.includes('RECEIVE')) return 'inventory';
    if (value.includes('UPDATE')) return 'edit_square';

    return 'history';
  }

  formatNumber(value: number): string {
    if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }

    return String(value);
  }

  formatDate(date?: string): string {
    if (!date) return 'No date';

    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}