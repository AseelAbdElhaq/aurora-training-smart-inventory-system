import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  User,
  UserService
} from '../../../services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit {

  isEdit = false;
  userId = 0;
  loading = false;
  saving = false;

  formData: User = {
    fullName: '',
    email: '',
    password: '',
    phone: '',
    username: '',
    roleId: 4,
    isActive: true
  };

  roles = [
    { id: 1, name: 'ADMIN' },
    { id: 2, name: 'INVENTORY MANAGER' },
    { id: 3, name: 'PURCHASING MANAGER' },
    { id: 4, name: 'EMPLOYEE' }
  ];

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (!id) {
        this.isEdit = false;
        this.userId = 0;
        return;
      }

      this.isEdit = true;
      this.userId = Number(id);

      this.loadUser(this.userId);
    });
  }

  loadUser(id: number): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.userService.getUserById(id).subscribe({
      next: (user: User) => {
        this.formData = {
          id: user.id,
          fullName: user.fullName || '',
          email: user.email || '',
          password: user.password || '',
          phone: user.phone || '',
          username: user.username || '',
          roleId: Number(user.roleId) || 4,
          isActive: user.isActive ?? true
        };

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('User load error:', error);
        this.loading = false;
        this.cdr.detectChanges();
        alert('Failed to load user data');
      }
    });
  }

  saveUser(): void {
    if (
      !this.formData.fullName?.trim() ||
      !this.formData.email?.trim() ||
      !this.formData.username?.trim() ||
      !this.formData.roleId
    ) {
      alert('Please fill all required fields');
      return;
    }

    if (!this.isEdit && !this.formData.password?.trim()) {
      alert('Password is required');
      return;
    }

    this.saving = true;
    this.cdr.detectChanges();

    const payload: User = {
      id: this.formData.id,
      fullName: this.formData.fullName.trim(),
      email: this.formData.email.trim(),
      password: this.formData.password || '',
      phone: this.formData.phone || '',
      username: this.formData.username.trim(),
      roleId: Number(this.formData.roleId),
      isActive: this.formData.isActive ?? true
    };

    const request = this.isEdit
      ? this.userService.updateUser(this.userId, payload)
      : this.userService.createUser(payload);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.cdr.detectChanges();

        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/users']);
        });
      },
      error: error => {
        console.error('Save user error:', error);
        this.saving = false;
        this.cdr.detectChanges();
        alert(error.error || 'Failed to save user');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/users']);
  }
}