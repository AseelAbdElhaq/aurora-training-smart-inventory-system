import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AiInsight, AiInsightService } from '../../../services/ai-insight.service';

type ViewMode = 'CARD' | 'TABLE';

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
  viewMode: ViewMode = 'CARD';

  constructor(
    private aiInsightService: AiInsightService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const savedView = localStorage.getItem('aiInsightViewMode') as ViewMode | null;

      if (savedView === 'CARD' || savedView === 'TABLE') {
        this.viewMode = savedView;
      }
    }
  }

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

  setViewMode(mode: ViewMode): void {
    this.viewMode = mode;

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('aiInsightViewMode', mode);
    }
  }
}