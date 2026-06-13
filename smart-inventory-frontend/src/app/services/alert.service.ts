import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Alert {
  id: number;
  alertType: string;
  message: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private apiUrl = 'http://localhost:8080/api/alerts';

  constructor(private http: HttpClient) {}

  getAlerts(): Observable<Alert[]> {
    return this.http.get<Alert[]>(this.apiUrl);
  }

  generateAlerts(): Observable<Alert[]> {
    return this.http.post<Alert[]>(`${this.apiUrl}/generate`, {});
  }

  deleteAlert(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      responseType: 'text'
    });
  }
}