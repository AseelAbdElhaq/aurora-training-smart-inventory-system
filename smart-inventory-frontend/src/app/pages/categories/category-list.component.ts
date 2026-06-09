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

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent implements OnInit {
  userRole: Role = 'ADMIN';

  categories: Category[] = [];
  keyword = '';
  loading = false;

  constructor(
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.userRole = (localStorage.getItem('role') as Role) || 'ADMIN';
    }
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = Array.isArray(data) ? [...data] : [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('CATEGORY ERROR:', error);
        this.categories = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  searchCategories(): void {
    const value = this.keyword.trim();

    if (!value) {
      this.loadCategories();
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    this.categoryService.searchCategories(value).subscribe({
      next: (data) => {
        this.categories = Array.isArray(data) ? [...data] : [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('SEARCH ERROR:', error);
        this.categories = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteCategory(id: number | undefined): void {
    if (!id) return;

    const confirmed = confirm('Are you sure you want to delete this category?');

    if (!confirmed) return;

    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this.categories = this.categories.filter(
          category => category.id !== id
        );
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('DELETE CATEGORY ERROR:', error);
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