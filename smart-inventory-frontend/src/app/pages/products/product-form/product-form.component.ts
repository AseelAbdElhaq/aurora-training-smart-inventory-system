import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Product, ProductService } from '../../../services/prouduct.service';
import { Category, CategoryService } from '../../../services/category.service';
import { Supplier, SupplierService } from '../../../services/supplier.service';

type Role =
  | 'ADMIN'
  | 'INVENTORY_MANAGER'
  | 'WAREHOUSE_EMPLOYEE'
  | 'PURCHASING_MANAGER';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {
  userRole: Role = 'ADMIN';

  productId: number | null = null;

  categories: Category[] = [];
  suppliers: Supplier[] = [];

  selectedCategoryId: number | null = null;
  selectedSupplierId: number | null = null;

  product: Product = {
    productName: '',
    sku: '',
    description: '',
    price: 0,
    quantity: 0,
    imageUrl: '',
    category: null,
    supplier: null
  };

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private supplierService: SupplierService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.userRole = (localStorage.getItem('role') as Role) || 'ADMIN';
    }
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadSuppliers();

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.productId = Number(id);
      this.loadProduct(this.productId);
    }
  }

  loadProduct(id: number): void {
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.selectedCategoryId = data.category?.id || null;
        this.selectedSupplierId = data.supplier?.id || null;
      },
      error: (error) => {
        console.error('Error loading product:', error);
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe({
      next: (data) => {
        this.suppliers = data;
      },
      error: (error) => {
        console.error('Error loading suppliers:', error);
      }
    });
  }

  canManage(): boolean {
    return this.userRole === 'ADMIN' || this.userRole === 'INVENTORY_MANAGER';
  }

  saveProduct(): void {
    this.product.category = this.selectedCategoryId
      ? { id: this.selectedCategoryId, categoryName: '' }
      : null;

    this.product.supplier = this.selectedSupplierId
      ? { id: this.selectedSupplierId, supplierName: '' }
      : null;

    if (this.productId) {
      this.productService.updateProduct(this.productId, this.product).subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Update error:', error);
        }
      });

      return;
    }

    this.productService.addProduct(this.product).subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: (error) => {
        console.error('Create error:', error);
      }
    });
  }
}