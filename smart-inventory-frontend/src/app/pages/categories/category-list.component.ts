import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
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

    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loading = false;
      }
    });
  }

  searchCategories(): void {
    const value = this.keyword.trim();

    if (!value) {
      this.loadCategories();
      return;
    }

    this.categoryService.searchCategories(value).subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Search error:', error);
      }
    });
  }

  deleteCategory(id: number | undefined): void {
    if (!id) return;

    const confirmed = confirm('Are you sure you want to delete this category?');

    if (!confirmed) return;

    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this.loadCategories();
      },
      error: (error) => {
        console.error('Delete error:', error);
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