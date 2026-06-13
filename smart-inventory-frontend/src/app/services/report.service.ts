import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = 'http://localhost:8080/api/reports';

  constructor(private http: HttpClient) {}

  downloadPdf(): void {
    this.http.get(`${this.apiUrl}/pdf`, { responseType: 'blob' }).subscribe(blob => {
      this.downloadFile(blob, 'inventory-report.pdf');
    });
  }

  downloadExcel(): void {
    this.http.get(`${this.apiUrl}/excel`, { responseType: 'blob' }).subscribe(blob => {
      this.downloadFile(blob, 'inventory-report.xlsx');
    });
  }

  private downloadFile(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = fileName;
    link.click();

    window.URL.revokeObjectURL(url);
  }
}