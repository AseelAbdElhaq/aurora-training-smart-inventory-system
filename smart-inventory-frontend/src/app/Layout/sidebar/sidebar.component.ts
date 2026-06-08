import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

type Role =
  | 'ADMIN'
  | 'INVENTORY_MANAGER'
  | 'WAREHOUSE_EMPLOYEE'
  | 'PURCHASING_MANAGER';

type ChildMenuItem = {
  label: string;
  icon: string;
  route: string;
};

type MenuItem = {
  label: string;
  icon: string;
  route?: string;
  roles: Role[];
  children?: ChildMenuItem[];
};

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  userRole: Role = 'ADMIN';
  openedMenu = '';

  menu: MenuItem[] = [
    {
      label: 'Home',
      icon: 'home',
      route: '/dashboard',
      roles: ['ADMIN', 'INVENTORY_MANAGER', 'WAREHOUSE_EMPLOYEE', 'PURCHASING_MANAGER']
    },
    {
      label: 'Product',
      icon: 'inventory_2',
      roles: ['ADMIN', 'INVENTORY_MANAGER', 'WAREHOUSE_EMPLOYEE', 'PURCHASING_MANAGER'],
      children: [
        { label: 'Add Product', icon: 'add_box', route: '/products/add' },
        { label: 'Product List', icon: 'format_list_bulleted', route: '/products' }
      ]
    },
    {
      label: 'Category',
      icon: 'category',
      roles: ['ADMIN', 'INVENTORY_MANAGER'],
      children: [
        { label: 'Add Category', icon: 'add_box', route: '/categories/add' },
        { label: 'Category List', icon: 'format_list_bulleted', route: '/categories' }
      ]
    },
    {
      label: 'Dashboard Analytics',
      icon: 'dashboard',
      route: '/dashboard-analytics',
      roles: ['ADMIN', 'INVENTORY_MANAGER']
    },
    {
      label: 'Stock',
      icon: 'assignment',
      route: '/stock',
      roles: ['ADMIN', 'INVENTORY_MANAGER', 'WAREHOUSE_EMPLOYEE']
    },
    {
      label: 'Warehouses',
      icon: 'warehouse',
      roles: ['ADMIN', 'INVENTORY_MANAGER', 'WAREHOUSE_EMPLOYEE'],
      children: [
        { label: 'Add Warehouse', icon: 'add_box', route: '/warehouses/add' },
        { label: 'Warehouse List', icon: 'format_list_bulleted', route: '/warehouses' }
      ]
    },
    {
      label: 'Suppliers',
      icon: 'local_shipping',
      route: '/suppliers',
      roles: ['ADMIN', 'PURCHASING_MANAGER']
    },
    {
      label: 'Purchase Orders',
      icon: 'description',
      route: '/purchase-orders',
      roles: ['ADMIN', 'INVENTORY_MANAGER', 'PURCHASING_MANAGER']
    },
    {
      label: 'Sales Orders',
      icon: 'shopping_cart',
      route: '/sales-orders',
      roles: ['ADMIN', 'INVENTORY_MANAGER', 'WAREHOUSE_EMPLOYEE']
    },
    {
      label: 'Reports',
      icon: 'bar_chart',
      route: '/reports',
      roles: ['ADMIN', 'INVENTORY_MANAGER', 'PURCHASING_MANAGER']
    },
    {
      label: 'AI Insights',
      icon: 'auto_awesome',
      route: '/ai-insights',
      roles: ['ADMIN', 'INVENTORY_MANAGER']
    },
    {
      label: 'Users',
      icon: 'group',
      route: '/users',
      roles: ['ADMIN']
    },
    {
      label: 'Settings',
      icon: 'settings',
      route: '/settings',
      roles: ['ADMIN']
    }
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const savedRole = localStorage.getItem('role') as Role | null;

      if (savedRole) {
        this.userRole = savedRole;
      }
    }

    if (this.router.url.startsWith('/products')) {
      this.openedMenu = 'Product';
    }

    if (this.router.url.startsWith('/categories')) {
      this.openedMenu = 'Category';
    }

    if (this.router.url.startsWith('/warehouses')) {
      this.openedMenu = 'Warehouses';
    }
  }

  canShow(item: MenuItem): boolean {
    return item.roles.includes(this.userRole);
  }

  toggle(label: string): void {
    this.openedMenu = this.openedMenu === label ? '' : label;
  }

  isActiveParent(item: MenuItem): boolean {
    if (item.label === 'Product') {
      return this.router.url.startsWith('/products');
    }

    if (item.label === 'Category') {
      return this.router.url.startsWith('/categories');
    }

    if (item.label === 'Warehouses') {
      return this.router.url.startsWith('/warehouses');
    }

    return false;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
      window.location.href = '/login';
    }
  }
}