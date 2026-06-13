import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiInsight, AiInsightService } from '../../../services/ai-insight.service';

@Component({
  selector: 'app-ai-insight-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-insight-list.component.html',
  styleUrl: './ai-insight-list.component.css'
})
export class AiInsightListComponent implements OnInit {
  insights: AiInsight[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private aiInsightService: AiInsightService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadInsights();
  }

  loadInsights(): void {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.aiInsightService.getInsights().subscribe({
      next: data => {
        this.insights = [...(data || [])];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('AI insights error:', error);
        this.errorMessage = error.error || 'Failed to load AI insights';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}