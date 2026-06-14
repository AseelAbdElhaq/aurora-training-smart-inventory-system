import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Category, CategoryService } from '../../services/category.service';

type Role =
  | 'ADMIN'
  | 'INVENTORY_MANAGER'
  | 'WAREHOUSE_EMPLOYEE'
  | 'PURCHASING_MANAGER';

type ViewMode = 'CARD' | 'TABLE';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent implements OnInit {
  userRole: Role = 'ADMIN';

  allCategories: Category[] = [];
  categories: Category[] = [];

  keyword = '';
  loading = false;
  viewMode: ViewMode = 'CARD';

  constructor(
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.userRole =
        ((localStorage.getItem('role') || 'ADMIN')
          .trim()
          .toUpperCase()
          .replace('ROLE_', '') as Role);

      const savedView = localStorage.getItem('categoryViewMode') as ViewMode | null;
      if (savedView === 'CARD' || savedView === 'TABLE') {
        this.viewMode = savedView;
      }
    }
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.categoryService.getCategories().subscribe({
      next: data => {
        this.allCategories = Array.isArray(data) ? [...data] : [];
        this.applySearch();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('CATEGORY ERROR:', error);
        this.allCategories = [];
        this.categories = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applySearch(): void {
    const value = this.keyword.trim().toLowerCase();

    this.categories = this.allCategories.filter(category => {
      const name = (category.categoryName || '').toLowerCase();
      const description = (category.description || '').toLowerCase();

      return !value || name.includes(value) || description.includes(value);
    });
  }

  searchCategories(): void {
    this.applySearch();
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode = mode;

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('categoryViewMode', mode);
    }
  }

  deleteCategory(id: number | undefined): void {
    if (!id) return;

    const confirmed = confirm('Are you sure you want to delete this category?');
    if (!confirmed) return;

    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this.allCategories = this.allCategories.filter(category => category.id !== id);
        this.applySearch();
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('DELETE CATEGORY ERROR:', error);
        alert(error.error || 'Failed to delete category');
      }
    });
  }

  canManage(): boolean {
    return this.userRole === 'ADMIN' || this.userRole === 'INVENTORY_MANAGER';
  }

  canDelete(): boolean {
    return this.userRole === 'ADMIN';
  }
}