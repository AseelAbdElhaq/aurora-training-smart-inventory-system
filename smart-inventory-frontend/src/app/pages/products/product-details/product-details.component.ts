import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Product, ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  loading = false;
  errorMessage = '';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.errorMessage = 'Invalid product ID.';
      return;
    }

    this.loadProduct(id);
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('PRODUCT DETAILS ERROR:', error);
        this.product = null;
        this.errorMessage = 'Product details could not be loaded.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
  hasError(): boolean {
  return !this.loading && this.errorMessage.length > 0;
}

showProduct(): boolean {
  return !this.loading && this.errorMessage.length === 0 && this.product !== null;
}
}