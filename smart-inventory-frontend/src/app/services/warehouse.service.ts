import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Warehouse {
  id?: number;
  warehouseName: string;
  location: string;
  capacity: number;
  currentCapacity: number;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  private apiUrl = 'http://localhost:8080/api/warehouses';

  constructor(private http: HttpClient) {}

  getWarehouses(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(this.apiUrl);
  }

  getWarehouseById(id: number): Observable<Warehouse> {
    return this.http.get<Warehouse>(`${this.apiUrl}/${id}`);
  }

  addWarehouse(warehouse: Warehouse): Observable<Warehouse> {
    return this.http.post<Warehouse>(this.apiUrl, warehouse);
  }

  updateWarehouse(id: number, warehouse: Warehouse): Observable<Warehouse> {
    return this.http.put<Warehouse>(`${this.apiUrl}/${id}`, warehouse);
  }

  deleteWarehouse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}