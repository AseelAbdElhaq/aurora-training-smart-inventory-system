import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Stock {
  id?: number;
  stockId?: number;
  product?: any;
  warehouse?: any;
  quantity: number;
  updatedAt?: string;
  isDeleted?: boolean;
}

export interface StockAvailability {
  availableQuantity: number;

  sourceWarehouseName: string;
  sourceCurrentCapacity: number;
  sourceTotalCapacity: number;
  sourceFreeSpace: number;

  destinationWarehouseName: string;
  destinationCurrentCapacity: number;
  destinationTotalCapacity: number;
  destinationFreeSpace: number;
}

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = 'http://localhost:8080/api/stocks';

  constructor(private http: HttpClient) {}

  private fixStock(stock: Stock): Stock {
    return {
      ...stock,
      id: stock.id ?? stock.stockId,
      product: stock.product
        ? {
            ...stock.product,
            id: stock.product.id ?? stock.product.productId
          }
        : null,
      warehouse: stock.warehouse
        ? {
            ...stock.warehouse,
            id: stock.warehouse.id ?? stock.warehouse.warehouseId
          }
        : null,
      quantity: Number(stock.quantity || 0)
    };
  }

  getAllStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(this.apiUrl).pipe(
      map(stocks => stocks.map(stock => this.fixStock(stock)))
    );
  }

  getStockById(id: number): Observable<Stock> {
    return this.http.get<Stock>(`${this.apiUrl}/${id}`).pipe(
      map(stock => this.fixStock(stock))
    );
  }

  getProductLocations(productId: number): Observable<Stock[]> {
    return this.http
      .get<Stock[]>(`${this.apiUrl}/product-locations/${productId}`)
      .pipe(
        map(stocks => stocks.map(stock => this.fixStock(stock)))
      );
  }

  getAvailability(
    productId: number,
    sourceWarehouseId: number,
    destinationWarehouseId: number
  ): Observable<StockAvailability> {
    return this.http.get<StockAvailability>(
      `${this.apiUrl}/availability?productId=${productId}&sourceWarehouseId=${sourceWarehouseId}&destinationWarehouseId=${destinationWarehouseId}`
    );
  }

  createStock(stock: any): Observable<Stock> {
    return this.http.post<Stock>(this.apiUrl, stock).pipe(
      map(savedStock => this.fixStock(savedStock))
    );
  }

  updateStock(id: number, stock: any): Observable<Stock> {
    return this.http.put<Stock>(`${this.apiUrl}/${id}`, stock).pipe(
      map(updatedStock => this.fixStock(updatedStock))
    );
  }

  deleteStock(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  transferStock(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/transfer`, data, {
      responseType: 'text'
    });
  }
}