import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Category, CategoryService } from '../../services/category.service';

type Role =
  | 'ADMIN'
  | 'INVENTORY_MANAGER'
  | 'WAREHOUSE_EMPLOYEE'
  | 'PURCHASING_MANAGER';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css'
})
export class CategoryFormComponent implements OnInit {
  userRole: Role = 'ADMIN';

  categoryId: number | null = null;

  category: Category = {
    categoryName: '',
    description: ''
  };

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.userRole = (localStorage.getItem('role') as Role) || 'ADMIN';
    }
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.categoryId = Number(id);
      this.loadCategory(this.categoryId);
    }
  }

  loadCategory(id: number): void {
    this.categoryService.getCategoryById(id).subscribe({
      next: (data) => {
        this.category = data;
      },
      error: (error) => {
        console.error('Error loading category:', error);
      }
    });
  }

  canManage(): boolean {
    return this.userRole === 'ADMIN' || this.userRole === 'INVENTORY_MANAGER';
  }

  saveCategory(): void {
    if (!this.category.categoryName.trim()) {
      alert('Category name is required');
      return;
    }

    if (this.categoryId) {
      this.categoryService.updateCategory(this.categoryId, this.category).subscribe({
        next: () => {
          this.router.navigate(['/categories']);
        },
        error: (error) => {
          console.error('Update category error:', error);
        }
      });

      return;
    }

    this.categoryService.addCategory(this.category).subscribe({
      next: () => {
        this.router.navigate(['/categories']);
      },
      error: (error) => {
        console.error('Add category error:', error);
      }
    });
  }
}