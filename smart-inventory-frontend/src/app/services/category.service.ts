import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

export interface Category {
  id?: number;
  categoryName: string;
  description?: string;
  isDeleted?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:8080/api/categories';

  private cachedCategories: Category[] | null = null;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    if (this.cachedCategories) {
      return of(this.cachedCategories);
    }

    return this.http.get<Category[]>(this.apiUrl).pipe(
      tap((categories) => {
        this.cachedCategories = categories;
      })
    );
  }

  refreshCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl).pipe(
      tap((categories) => {
        this.cachedCategories = categories;
      })
    );
  }

  getCategoryById(id: number): Observable<Category> {
    const cachedCategory = this.cachedCategories?.find(
      (category) => category.id === id
    );

    if (cachedCategory) {
      return of(cachedCategory);
    }

    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category).pipe(
      tap((savedCategory) => {
        if (this.cachedCategories) {
          this.cachedCategories = [...this.cachedCategories, savedCategory];
        }
      })
    );
  }

  updateCategory(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category).pipe(
      tap((updatedCategory) => {
        if (this.cachedCategories) {
          this.cachedCategories = this.cachedCategories.map((item) =>
            item.id === id ? updatedCategory : item
          );
        }
      })
    );
  }

  deleteCategory(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      responseType: 'text'
    }).pipe(
      tap(() => {
        if (this.cachedCategories) {
          this.cachedCategories = this.cachedCategories.filter(
            (category) => category.id !== id
          );
        }
      })
    );
  }

  searchCategories(keyword: string): Observable<Category[]> {
    return this.http.get<Category[]>(
      `${this.apiUrl}/search?keyword=${keyword}`
    );
  }
}