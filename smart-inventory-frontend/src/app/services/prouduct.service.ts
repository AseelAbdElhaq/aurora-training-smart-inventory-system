import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  id: number;
  categoryName: string;
  description?: string;
}

export interface Supplier {
  id: number;
  supplierName: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface Product {
  id?: number;
  productName: string;
  sku: string;
  description: string;
  price: number;
  quantity: number;
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

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  searchProducts(keyword: string): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.apiUrl}/search?keyword=${keyword}`
    );
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      responseType: 'text'
    });
  }
}