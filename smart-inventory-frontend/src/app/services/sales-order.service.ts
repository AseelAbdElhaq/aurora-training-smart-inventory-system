import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SalesOrder {
  id?: number;
  customerName?: string;
  warehouse?: {
    id?: number;
    warehouseName?: string;
    location?: string;
    capacity?: number;
    currentCapacity?: number;
  };
  status?: string;
  totalAmount?: number;
  createdAt?: string;
  items?: SalesOrderItem[];
}

export interface SalesOrderItem {
  id?: number;
  product?: {
    id?: number;
    productName?: string;
    sku?: string;
    price?: number;
  };
  quantity?: number;
  unitPrice?: number;
}

export interface WarehouseProduct {
  id: number;
  productName: string;
  sku: string;
  price: number;
  availableQuantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class SalesOrderService {
  private apiUrl = 'http://localhost:8080/api/sales-orders';

  constructor(private http: HttpClient) {}

  getOrders(): Observable<SalesOrder[]> {
    return this.http.get<SalesOrder[]>(this.apiUrl);
  }

  getOrderById(id: number): Observable<SalesOrder> {
    return this.http.get<SalesOrder>(`${this.apiUrl}/${id}`);
  }

  getProductsByWarehouse(warehouseId: number): Observable<WarehouseProduct[]> {
    return this.http.get<WarehouseProduct[]>(`${this.apiUrl}/warehouse/${warehouseId}/products`);
  }

  createOrder(order: SalesOrder): Observable<SalesOrder> {
    return this.http.post<SalesOrder>(this.apiUrl, order);
  }

  updateOrder(id: number, order: SalesOrder): Observable<SalesOrder> {
    return this.http.put<SalesOrder>(`${this.apiUrl}/${id}`, order);
  }

  completeOrder(id: number): Observable<SalesOrder> {
    return this.http.put<SalesOrder>(`${this.apiUrl}/${id}/complete`, {});
  }

  cancelOrder(id: number): Observable<SalesOrder> {
    return this.http.put<SalesOrder>(`${this.apiUrl}/${id}/cancel`, {});
  }
}