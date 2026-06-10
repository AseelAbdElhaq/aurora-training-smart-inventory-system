import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User, UserService } from '../../../services/user.service';

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

  formData: User = {
    fullName: '',
    email: '',
    password: '',
    phone: '',
    username: '',
    roleId: 4
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
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEdit = true;
      this.userId = +id;

      this.userService.getUserById(this.userId).subscribe(user => {
        this.formData = {
          fullName: user.fullName,
          email: user.email,
          password: user.password,
          phone: user.phone,
          username: user.username,
          roleId: user.roleId
        };
      });
    }
  }

  saveUser(): void {
    if (
      !this.formData.fullName ||
      !this.formData.email ||
      !this.formData.password ||
      !this.formData.username ||
      !this.formData.roleId
    ) {
      alert('Please fill all required fields');
      return;
    }

    if (this.isEdit) {
      this.userService.updateUser(this.userId, this.formData).subscribe(() => {
        this.router.navigate(['/users']);
      });
    } else {
      this.userService.createUser(this.formData).subscribe(() => {
        this.router.navigate(['/users']);
      });
    }
  }
}