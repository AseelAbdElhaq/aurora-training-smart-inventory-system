import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private apiUrl = 'http://localhost:8080/api/stocks';

  constructor(private http: HttpClient) {}

  getAllStocks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getStockById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createStock(stock: any): Observable<any> {
    return this.http.post(this.apiUrl, stock);
  }

  updateStock(id: number, stock: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, stock);
  }

  deleteStock(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  transferStock(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/transfer`, data);
}
}