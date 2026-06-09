import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Warehouse {
  id?: number;
  warehouseId?: number;
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

  private fixWarehouse(warehouse: Warehouse): Warehouse {
    return {
      ...warehouse,
      id: warehouse.id ?? warehouse.warehouseId,
      currentCapacity: warehouse.currentCapacity ?? 0
    };
  }

  getWarehouses(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(this.apiUrl).pipe(
      map(warehouses => warehouses.map(warehouse => this.fixWarehouse(warehouse)))
    );
  }

  getWarehouseById(id: number): Observable<Warehouse> {
    return this.http.get<Warehouse>(`${this.apiUrl}/${id}`).pipe(
      map(warehouse => this.fixWarehouse(warehouse))
    );
  }

  addWarehouse(warehouse: Warehouse): Observable<Warehouse> {
    return this.http.post<Warehouse>(this.apiUrl, warehouse).pipe(
      map(savedWarehouse => this.fixWarehouse(savedWarehouse))
    );
  }

  updateWarehouse(id: number, warehouse: Warehouse): Observable<Warehouse> {
    return this.http.put<Warehouse>(`${this.apiUrl}/${id}`, warehouse).pipe(
      map(updatedWarehouse => this.fixWarehouse(updatedWarehouse))
    );
  }

  deleteWarehouse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}