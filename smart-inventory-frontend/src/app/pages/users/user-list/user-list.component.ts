import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  User,
  UserService
} from '../../../services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: User[] = [];

  loading = true;

  constructor(
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {

    this.loading = true;

    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },

      error: () => {
        this.loading = false;
      }
    });
  }

  roleName(roleId: number): string {

    if (roleId === 1) {
      return 'ADMIN';
    }

    if (roleId === 2) {
      return 'INVENTORY MANAGER';
    }

    if (roleId === 3) {
      return 'PURCHASING MANAGER';
    }

    if (roleId === 4) {
      return 'EMPLOYEE';
    }

    return 'UNKNOWN';
  }

  deleteUser(id?: number): void {

    if (!id) {
      return;
    }

    const confirmed = confirm(
      'Are you sure you want to remove this user?'
    );

    if (!confirmed) {
      return;
    }

    this.userService.deleteUser(id)
      .subscribe(() => {
        this.loadUsers();
      });
  }
}