import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface LoginResponse {
  fullName: string;
  username: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      {
        email,
        password
      }
    );
  }

  normalizeRole(role: string): string {
    const cleanRole = (role || '').trim().toUpperCase().replace('ROLE_', '');

    if (cleanRole === 'EMPLOYEE') {
      return 'WAREHOUSE_EMPLOYEE';
    }

    return cleanRole;
  }

  saveUser(user: LoginResponse): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.setItem('fullName', user.fullName || 'User');
    localStorage.setItem('username', user.username || user.email || 'user');
    localStorage.setItem('email', user.email || '');
    localStorage.setItem('role', this.normalizeRole(user.role));
  }

  logout(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.clear();
  }
}