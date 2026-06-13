import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Alert, AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-alert-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './alert-list.component.html',
  styleUrl: './alert-list.component.css'
})
export class AlertListComponent implements OnInit {
  alerts: Alert[] = [];
  loading = false;

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.loadAlerts();
  }

  loadAlerts(): void {
    this.loading = true;

    this.alertService.getAlerts().subscribe({
      next: data => {
        this.alerts = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Failed to load alerts');
      }
    });
  }

  generateAlerts(): void {
    this.loading = true;

    this.alertService.generateAlerts().subscribe({
      next: data => {
        this.alerts = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Failed to generate alerts');
      }
    });
  }

  deleteAlert(id: number): void {
    this.alertService.deleteAlert(id).subscribe({
      next: () => this.loadAlerts(),
      error: () => alert('Failed to delete alert')
    });
  }
}