import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Product, ProductService } from '../../../services/product.service';

type Role =
  | 'ADMIN'
  | 'INVENTORY_MANAGER'
  | 'WAREHOUSE_EMPLOYEE'
  | 'PURCHASING_MANAGER';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  userRole: Role = 'ADMIN';

  products: Product[] = [];
  keyword = '';
  loading = false;

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.userRole = (localStorage.getItem('role') as Role) || 'ADMIN';
    }
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = Array.isArray(data) ? [...data] : [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('PRODUCT LOAD ERROR:', error);
        this.products = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  searchProducts(): void {
    const value = this.keyword.trim();

    if (!value) {
      this.loadProducts();
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    this.productService.searchProducts(value).subscribe({
      next: (data) => {
        this.products = Array.isArray(data) ? [...data] : [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('PRODUCT SEARCH ERROR:', error);
        this.products = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteProduct(id: number | undefined): void {
    if (!id) return;

    const confirmed = confirm('Are you sure you want to archive this product?');
    if (!confirmed) return;

    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter(product => product.id !== id);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('PRODUCT DELETE ERROR:', error);
      }
    });
  }

  canAdd(): boolean {
    return this.userRole === 'ADMIN' || this.userRole === 'INVENTORY_MANAGER';
  }

  canEdit(): boolean {
    return this.userRole === 'ADMIN' || this.userRole === 'INVENTORY_MANAGER';
  }

  canDelete(): boolean {
    return this.userRole === 'ADMIN';
  }
}