import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { Product, ProductService } from '../../../services/product.service';
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
  loading = false;

  categories: Category[] = [];
  suppliers: Supplier[] = [];

  selectedCategoryId: number | null = null;
  selectedSupplierId: number | null = null;

  product: Product = {
    productName: '',
    sku: '',
    description: '',
    price: 0,
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
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.userRole = (localStorage.getItem('role') as Role) || 'ADMIN';
    }
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.productId = id ? Number(id) : null;

    this.loadFormData();
  }

  loadFormData(): void {
    this.loading = true;
    this.cdr.detectChanges();

    if (this.productId) {
      forkJoin({
        categories: this.categoryService.getCategories(),
        suppliers: this.supplierService.getSuppliers(),
        product: this.productService.getProductById(this.productId)
      }).subscribe({
        next: ({ categories, suppliers, product }) => {
          this.categories = Array.isArray(categories) ? categories : [];
          this.suppliers = Array.isArray(suppliers) ? suppliers : [];

          this.product = {
            ...product,
            productName: product.productName || '',
            sku: product.sku || '',
            description: product.description || '',
            price: product.price || 0,
            imageUrl: product.imageUrl || '',
            category: product.category || null,
            supplier: product.supplier || null
          };

          this.selectedCategoryId = product.category?.id ?? null;
          this.selectedSupplierId = product.supplier?.id ?? null;

          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('PRODUCT FORM LOAD ERROR:', error);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });

      return;
    }

    forkJoin({
      categories: this.categoryService.getCategories(),
      suppliers: this.supplierService.getSuppliers()
    }).subscribe({
      next: ({ categories, suppliers }) => {
        this.categories = Array.isArray(categories) ? categories : [];
        this.suppliers = Array.isArray(suppliers) ? suppliers : [];

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('FORM DATA LOAD ERROR:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  canManage(): boolean {
    return this.userRole === 'ADMIN' || this.userRole === 'INVENTORY_MANAGER';
  }

  saveProduct(): void {
    if (!this.product.productName.trim()) {
      alert('Product name is required');
      return;
    }

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
          console.error('PRODUCT UPDATE ERROR:', error);
          alert(error.error || 'Product update failed');
        }
      });

      return;
    }

    this.productService.addProduct(this.product).subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: (error) => {
        console.error('PRODUCT CREATE ERROR:', error);
        alert(error.error || 'Product create failed');
      }
    });
  }
}