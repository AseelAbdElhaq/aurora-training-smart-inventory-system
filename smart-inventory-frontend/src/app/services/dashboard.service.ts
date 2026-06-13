import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardSummary {
  totalProducts: number;
  totalWarehouses: number;
  totalSuppliers: number;
  totalStock: number;
  totalPurchaseOrders: number;
  totalSalesOrders: number;
  lowStockAlerts: number;
}

export interface WarehouseCapacity {
  warehouseName: string;
  capacity: number;
  used: number;
  available: number;
  percentage: number;
}

export interface RecentActivity {
  title: string;
  warehouseName: string;
  quantity: number;
  movementType: string;
  movementDate: string;
}

export interface TopProduct {
  productName: string;
  sku: string;
  soldQuantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8080/api/dashboard';

  constructor(private http: HttpClient) {}

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.apiUrl}/summary`);
  }

  getWarehouseCapacity(): Observable<WarehouseCapacity[]> {
    return this.http.get<WarehouseCapacity[]>(`${this.apiUrl}/warehouse-capacity`);
  }

  getRecentActivities(): Observable<RecentActivity[]> {
    return this.http.get<RecentActivity[]>(`${this.apiUrl}/recent-activities`);
  }

  getTopProducts(): Observable<TopProduct[]> {
    return this.http.get<TopProduct[]>(`${this.apiUrl}/top-products`);
  }
}