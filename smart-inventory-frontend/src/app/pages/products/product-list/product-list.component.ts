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

  allProducts: Product[] = [];
  products: Product[] = [];

  keyword = '';
  selectedCategory = 'ALL';
  selectedSupplier = 'ALL';
  selectedPrice = 'ALL';

  categories: string[] = [];
  suppliers: string[] = [];

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
        this.allProducts = Array.isArray(data) ? [...data] : [];
        this.buildFilters();
        this.applyFilters();

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('PRODUCT LOAD ERROR:', error);
        this.allProducts = [];
        this.products = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  buildFilters(): void {
    this.categories = [
      ...new Set(
        this.allProducts
          .map(product => product.category?.categoryName)
          .filter((name): name is string => !!name)
      )
    ];

    this.suppliers = [
      ...new Set(
        this.allProducts
          .map(product => product.supplier?.supplierName)
          .filter((name): name is string => !!name)
      )
    ];
  }

  applyFilters(): void {
    const searchValue = this.keyword.trim().toLowerCase();

    this.products = this.allProducts.filter(product => {
      const productName = (product.productName || '').toLowerCase();
      const sku = (product.sku || '').toLowerCase();
      const category = product.category?.categoryName || '';
      const supplier = product.supplier?.supplierName || '';
      const price = Number(product.price || 0);

      const matchesSearch =
        !searchValue ||
        productName.includes(searchValue) ||
        sku.includes(searchValue);

      const matchesCategory =
        this.selectedCategory === 'ALL' ||
        category === this.selectedCategory;

      const matchesSupplier =
        this.selectedSupplier === 'ALL' ||
        supplier === this.selectedSupplier;

      let matchesPrice = true;

      if (this.selectedPrice === 'LOW') {
        matchesPrice = price < 100;
      }

      if (this.selectedPrice === 'MEDIUM') {
        matchesPrice = price >= 100 && price <= 1000;
      }

      if (this.selectedPrice === 'HIGH') {
        matchesPrice = price > 1000;
      }

      return matchesSearch && matchesCategory && matchesSupplier && matchesPrice;
    });
  }

  resetFilters(): void {
    this.keyword = '';
    this.selectedCategory = 'ALL';
    this.selectedSupplier = 'ALL';
    this.selectedPrice = 'ALL';
    this.applyFilters();
  }

  deleteProduct(id: number | undefined): void {
    if (!id) return;

    const confirmed = confirm('Are you sure you want to archive this product?');
    if (!confirmed) return;

    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.allProducts = this.allProducts.filter(product => product.id !== id);
        this.applyFilters();
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