import { Component, Inject, OnInit, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  User,
  UserService
} from '../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  loading = false;
  saving = false;

  currentEmail = '';

  formData: User = {
    fullName: '',
    email: '',
    password: '',
    phone: '',
    username: '',
    roleId: 4,
    isActive: true
  };

  constructor(
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const email = localStorage.getItem('email');

    if (!email) {
      alert('Please login again');
      this.router.navigate(['/login']);
      return;
    }

    this.currentEmail = email;
    this.loadProfile(email);
  }

  loadProfile(email: string): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.userService.getProfileByEmail(email).subscribe({
      next: user => {
        this.formData = {
          id: user.id,
          fullName: user.fullName || '',
          email: user.email || '',
          password: '',
          phone: user.phone || '',
          username: user.username || '',
          roleId: Number(user.roleId) || 4,
          isActive: user.isActive ?? true
        };

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Profile load error:', error);
        this.loading = false;
        this.cdr.detectChanges();
        alert('Failed to load profile');
      }
    });
  }

  saveProfile(): void {
    if (!this.formData.id) {
      alert('User ID not found');
      return;
    }

    if (
      !this.formData.fullName.trim() ||
      !this.formData.username.trim() ||
      !this.formData.email.trim()
    ) {
      alert('Please fill all required fields');
      return;
    }

    this.saving = true;
    this.cdr.detectChanges();

    const payload: User = {
      id: this.formData.id,
      fullName: this.formData.fullName.trim(),
      email: this.formData.email.trim(),
      username: this.formData.username.trim(),
      phone: this.formData.phone || '',
      password: this.formData.password || '',
      roleId: this.formData.roleId,
      isActive: true
    };

    this.userService.updateProfile(this.formData.id, payload).subscribe({
      next: updated => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('email', updated.email);
          localStorage.setItem('username', updated.username);
          localStorage.setItem('fullName', updated.fullName);
        }

        this.saving = false;
        this.formData.password = '';
        this.cdr.detectChanges();

        alert('Profile updated successfully');
      },
      error: error => {
        console.error('Profile update error:', error);
        this.saving = false;
        this.cdr.detectChanges();
        alert(error.error || 'Failed to update profile');
      }
    });
  }

  roleName(roleId?: number): string {
    if (roleId === 1) return 'ADMIN';
    if (roleId === 2) return 'INVENTORY MANAGER';
    if (roleId === 3) return 'PURCHASING MANAGER';
    if (roleId === 4) return 'WAREHOUSE EMPLOYEE';

    return 'UNKNOWN';
  }
}