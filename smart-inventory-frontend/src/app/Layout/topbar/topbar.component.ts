import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
  username = 'user';
  role = 'ROLE';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.username = localStorage.getItem('username') || 'user';
      this.role = localStorage.getItem('role') || 'ROLE';
    }
  }

  get firstLetter(): string {
    return this.username.charAt(0).toUpperCase();
  }
}