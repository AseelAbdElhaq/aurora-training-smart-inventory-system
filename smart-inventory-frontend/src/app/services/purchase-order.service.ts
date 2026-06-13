import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Supplier {
  id: number;
  supplierName: string;
}

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

export interface PurchaseOrderItem {
  id?: number;
  product: Product | null;
  quantity: number;
  unitPrice: number;
}

export interface PurchaseOrder {
  id?: number;
  supplier: Supplier | null;
  warehouse: Warehouse | null;
  status?: string;
  totalAmount?: number;
  createdAt?: string;
  isDeleted?: boolean;
  items: PurchaseOrderItem[];
}

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {
  private apiUrl = 'http://localhost:8080/api/purchase-orders';

  constructor(private http: HttpClient) {}

  getOrders(): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(this.apiUrl);
  }

  getOrderById(id: number): Observable<PurchaseOrder> {
    return this.http.get<PurchaseOrder>(`${this.apiUrl}/${id}`);
  }

  createOrder(order: PurchaseOrder): Observable<PurchaseOrder> {
    return this.http.post<PurchaseOrder>(this.apiUrl, order);
  }

  updateOrder(id: number, order: PurchaseOrder): Observable<PurchaseOrder> {
    return this.http.put<PurchaseOrder>(`${this.apiUrl}/${id}`, order);
  }

  receiveOrder(id: number): Observable<PurchaseOrder> {
    return this.http.put<PurchaseOrder>(`${this.apiUrl}/${id}/receive`, {});
  }

  cancelOrder(id: number): Observable<PurchaseOrder> {
    return this.http.put<PurchaseOrder>(`${this.apiUrl}/${id}/cancel`, {});
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}