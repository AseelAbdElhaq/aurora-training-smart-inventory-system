import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Category {
  id?: number;
  categoryId?: number;
  categoryName: string;
  description?: string;
  isDeleted?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:8080/api/categories';

  constructor(private http: HttpClient) {}

  private fixCategory(category: Category): Category {
    return {
      ...category,
      id: category.id ?? category.categoryId
    };
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl).pipe(
      map(categories => categories.map(category => this.fixCategory(category)))
    );
  }

  refreshCategories(): Observable<Category[]> {
    return this.getCategories();
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`).pipe(
      map(category => this.fixCategory(category))
    );
  }

  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category).pipe(
      map(savedCategory => this.fixCategory(savedCategory))
    );
  }

  updateCategory(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category).pipe(
      map(updatedCategory => this.fixCategory(updatedCategory))
    );
  }

  deleteCategory(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      responseType: 'text'
    });
  }

  searchCategories(keyword: string): Observable<Category[]> {
    return this.http
      .get<Category[]>(`${this.apiUrl}/search?keyword=${encodeURIComponent(keyword)}`)
      .pipe(
        map(categories => categories.map(category => this.fixCategory(category)))
      );
  }
}