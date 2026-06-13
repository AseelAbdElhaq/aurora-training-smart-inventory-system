import { Component } from '@angular/core';
import { ReportService } from '../../../services/report.service';

@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [],
  templateUrl: './report-list.component.html',
  styleUrl: './report-list.component.css'
})
export class ReportListComponent {

  constructor(private reportService: ReportService) {}

  exportPdf(): void {
    this.reportService.downloadPdf();
  }

  exportExcel(): void {
    this.reportService.downloadExcel();
  }
}