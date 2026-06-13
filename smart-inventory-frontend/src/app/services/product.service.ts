import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Category {
  id?: number;
  categoryId?: number;
  categoryName: string;
  description?: string;
}

export interface Supplier {
  id?: number;
  supplierId?: number;
  supplierName: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface Product {
  id?: number;
  productId?: number;
  productName: string;
  sku: string;
  description: string;
  price: number;
  quantity?: number;
  imageUrl?: string;
  category?: Category | null;
  supplier?: Supplier | null;
  isDeleted?: boolean;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) {}

  private fixProduct(product: Product): Product {
    return {
      ...product,
      id: product.id ?? product.productId,
      category: product.category
        ? {
            ...product.category,
            id: product.category.id ?? product.category.categoryId
          }
        : null,
      supplier: product.supplier
        ? {
            ...product.supplier,
            id: product.supplier.id ?? product.supplier.supplierId
          }
        : null
    };
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      map(products => products.map(product => this.fixProduct(product)))
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      map(product => this.fixProduct(product))
    );
  }

  searchProducts(keyword: string): Observable<Product[]> {
    return this.http
      .get<Product[]>(`${this.apiUrl}/search?keyword=${encodeURIComponent(keyword)}`)
      .pipe(
        map(products => products.map(product => this.fixProduct(product)))
      );
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product).pipe(
      map(savedProduct => this.fixProduct(savedProduct))
    );
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product).pipe(
      map(updatedProduct => this.fixProduct(updatedProduct))
    );
  }

  deleteProduct(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      responseType: 'text'
    });
  }
}