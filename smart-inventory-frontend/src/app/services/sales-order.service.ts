import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Warehouse {
  id: number;
  warehouseName: string;
  location?: string;
  capacity?: number;
  currentCapacity?: number;
}

export interface Product {
  id: number;
  productName: string;
  sku: string;
  price: number;
}

export interface SalesOrderItem {
  id?: number;
  product: Product | null;
  quantity: number;
  unitPrice: number;
}

export interface SalesOrder {
  id?: number;
  customerName: string;
  warehouse: Warehouse | null;
  status?: 'PENDING' | 'COMPLETED' | 'CANCELLED' | string;
  totalAmount?: number;
  createdAt?: string;
  items: SalesOrderItem[];
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