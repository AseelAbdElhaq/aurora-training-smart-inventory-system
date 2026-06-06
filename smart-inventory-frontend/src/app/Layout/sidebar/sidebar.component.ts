import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

type Role =
  | 'ADMIN'
  | 'INVENTORY_MANAGER'
  | 'WAREHOUSE_EMPLOYEE'
  | 'PURCHASING_MANAGER';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  userRole: Role = 'ADMIN';

  menu = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard', roles: ['ADMIN', 'INVENTORY_MANAGER', 'WAREHOUSE_EMPLOYEE', 'PURCHASING_MANAGER'] },
    { label: 'Products', icon: 'inventory_2', route: '/products', roles: ['ADMIN', 'INVENTORY_MANAGER', 'WAREHOUSE_EMPLOYEE', 'PURCHASING_MANAGER'] },
    { label: 'Warehouses', icon: 'warehouse', route: '/warehouses', roles: ['ADMIN', 'INVENTORY_MANAGER', 'WAREHOUSE_EMPLOYEE', 'PURCHASING_MANAGER'] },
    { label: 'Stock', icon: 'assignment', route: '/stock', roles: ['ADMIN', 'INVENTORY_MANAGER', 'WAREHOUSE_EMPLOYEE', 'PURCHASING_MANAGER'] },
    { label: 'Stock Movements', icon: 'sync_alt', route: '/stock-movements', roles: ['ADMIN', 'INVENTORY_MANAGER', 'WAREHOUSE_EMPLOYEE', 'PURCHASING_MANAGER'] },
    { label: 'Suppliers', icon: 'local_shipping', route: '/suppliers', roles: ['ADMIN', 'PURCHASING_MANAGER'] },
    { label: 'Purchase Orders', icon: 'description', route: '/purchase-orders', roles: ['ADMIN', 'INVENTORY_MANAGER', 'PURCHASING_MANAGER'] },
    { label: 'Sales Orders', icon: 'shopping_cart', route: '/sales-orders', roles: ['ADMIN', 'INVENTORY_MANAGER'] },
    { label: 'Alerts', icon: 'notifications', route: '/alerts', roles: ['ADMIN', 'INVENTORY_MANAGER', 'WAREHOUSE_EMPLOYEE', 'PURCHASING_MANAGER'] },
    { label: 'Reports', icon: 'bar_chart', route: '/reports', roles: ['ADMIN', 'INVENTORY_MANAGER', 'PURCHASING_MANAGER'] },
    { label: 'AI Insights', icon: 'auto_awesome', route: '/ai-insights', roles: ['ADMIN', 'INVENTORY_MANAGER', 'PURCHASING_MANAGER'] },
    { label: 'Users', icon: 'group', route: '/users', roles: ['ADMIN'] },
    { label: 'Settings', icon: 'settings', route: '/settings', roles: ['ADMIN'] }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.userRole = (localStorage.getItem('role') || 'ADMIN') as Role;
    }
  }

  canShow(item: any): boolean {
    return item.roles.includes(this.userRole);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
      window.location.href = '/login';
    }
  }
}