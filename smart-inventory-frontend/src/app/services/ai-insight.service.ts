import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AiInsight {
  type: string;
  title: string;
  message: string;
  recommendation: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiInsightService {
  private apiUrl = 'http://localhost:8080/api/ai-insights';

  constructor(private http: HttpClient) {}

  getInsights(): Observable<AiInsight[]> {
    return this.http.get<AiInsight[]>(this.apiUrl);
  }
}