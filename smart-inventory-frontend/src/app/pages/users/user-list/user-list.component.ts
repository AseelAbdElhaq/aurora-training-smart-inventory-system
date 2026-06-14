import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  User,
  UserService
} from '../../../services/user.service';

type ViewMode = 'CARD' | 'TABLE';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = false;
  errorMessage = '';
  viewMode: ViewMode = 'CARD';

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const savedView = localStorage.getItem('userViewMode') as ViewMode | null;

      if (savedView === 'CARD' || savedView === 'TABLE') {
        this.viewMode = savedView;
      }
    }
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.userService.getUsers().subscribe({
      next: data => {
        this.users = [...(data || [])];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Users load error:', error);
        this.users = [];
        this.loading = false;
        this.errorMessage = error.error || 'Failed to load users';
        this.cdr.detectChanges();
      }
    });
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode = mode;

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('userViewMode', mode);
    }
  }

  roleName(roleId?: number): string {
    if (roleId === 1) return 'ADMIN';
    if (roleId === 2) return 'INVENTORY MANAGER';
    if (roleId === 3) return 'PURCHASING MANAGER';
    if (roleId === 4) return 'EMPLOYEE';

    return 'UNKNOWN';
  }

  getRoleClass(roleId?: number): string {
    if (roleId === 1) return 'admin';
    if (roleId === 2) return 'inventory';
    if (roleId === 3) return 'purchase';
    if (roleId === 4) return 'employee';

    return 'employee';
  }

  getDisplayName(user: User): string {
    if (user.roleId === 1 && user.email === 'admin1@gmail.com') {
      return 'Ahmad Al-Kurd';
    }

    return user.fullName || 'No name';
  }

  getDisplayEmail(user: User): string {
    if (user.roleId === 1 && user.email === 'admin1@gmail.com') {
      return 'ahmad.admin@inventra.com';
    }

    return user.email || 'No email';
  }

  getInitial(name?: string): string {
    if (!name || name.trim().length === 0) return 'U';
    return name.trim().charAt(0).toUpperCase();
  }

  deleteUser(id?: number): void {
    if (!id) return;

    if (!confirm('Are you sure you want to remove this user?')) {
      return;
    }

    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: error => {
        console.error('Delete user error:', error);
        alert(error.error || 'Failed to remove user');
      }
    });
  }
}