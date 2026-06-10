import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';
import { filter } from 'rxjs';

type Role =
  | 'ADMIN'
  | 'INVENTORY_MANAGER'
  | 'WAREHOUSE_EMPLOYEE'
  | 'PURCHASING_MANAGER';

type ChildMenuItem = {
  label: string;
  icon: string;
  route: string;
  roles: Role[];
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
        { label: 'Add Product', icon: 'add_box', route: '/products/add', roles: ['ADMIN', 'INVENTORY_MANAGER'] },
        { label: 'Product List', icon: 'format_list_bulleted', route: '/products', roles: ['ADMIN', 'INVENTORY_MANAGER', 'WAREHOUSE_EMPLOYEE', 'PURCHASING_MANAGER'] }
      ]
    },
    {
      label: 'Category',
      icon: 'category',
      roles: ['ADMIN', 'INVENTORY_MANAGER'],
      children: [
        { label: 'Add Category', icon: 'add_box', route: '/categories/add', roles: ['ADMIN', 'INVENTORY_MANAGER'] },
        { label: 'Category List', icon: 'format_list_bulleted', route: '/categories', roles: ['ADMIN', 'INVENTORY_MANAGER'] }
      ]
    },
    {
      label: 'Stock',
      icon: 'assignment',
      roles: ['ADMIN', 'INVENTORY_MANAGER', 'WAREHOUSE_EMPLOYEE'],
      children: [
        { label: 'Add Stock', icon: 'add_box', route: '/stock/add', roles: ['ADMIN', 'INVENTORY_MANAGER', 'WAREHOUSE_EMPLOYEE'] },
        { label: 'Stock List', icon: 'format_list_bulleted', route: '/stock', roles: ['ADMIN', 'INVENTORY_MANAGER', 'WAREHOUSE_EMPLOYEE'  ] },
        { label: 'Transfer Stock', icon: 'sync_alt', route: '/stock/transfer', roles: ['ADMIN', 'INVENTORY_MANAGER'] }
      ]
    },
    {
      label: 'Warehouses',
      icon: 'warehouse',
      roles: ['ADMIN', 'INVENTORY_MANAGER', 'WAREHOUSE_EMPLOYEE'],
      children: [
        { label: 'Add Warehouse', icon: 'add_box', route: '/warehouses/add', roles: ['ADMIN', 'INVENTORY_MANAGER'] },
        { label: 'Warehouse List', icon: 'format_list_bulleted', route: '/warehouses', roles: ['ADMIN', 'INVENTORY_MANAGER', 'WAREHOUSE_EMPLOYEE'] }
      ]
    },
    {
      label: 'Suppliers',
      icon: 'local_shipping',
      roles: ['ADMIN', 'PURCHASING_MANAGER'],
      children: [
        { label: 'Add Supplier', icon: 'add_box', route: '/suppliers/add', roles: ['ADMIN', 'PURCHASING_MANAGER'] },
        { label: 'Supplier List', icon: 'format_list_bulleted', route: '/suppliers', roles: ['ADMIN', 'PURCHASING_MANAGER'] }
      ]
    },
    {
      label: 'Purchase Orders',
      icon: 'description',
      roles: ['ADMIN', 'INVENTORY_MANAGER', 'PURCHASING_MANAGER'],
      children: [
        { label: 'Add Purchase Order', icon: 'add_box', route: '/purchase-orders/add', roles: ['ADMIN', 'INVENTORY_MANAGER', 'PURCHASING_MANAGER'] },
        { label: 'Purchase Order List', icon: 'format_list_bulleted', route: '/purchase-orders', roles: ['ADMIN', 'INVENTORY_MANAGER', 'PURCHASING_MANAGER'] }
      ]
    },
    {
      label: 'Sales Orders',
      icon: 'shopping_cart',
      roles: ['ADMIN', 'INVENTORY_MANAGER', 'WAREHOUSE_EMPLOYEE'],
      children: [
        { label: 'Add Sales Order', icon: 'add_box', route: '/sales-orders/add', roles: ['ADMIN', 'INVENTORY_MANAGER'] },
        { label: 'Sales Order List', icon: 'format_list_bulleted', route: '/sales-orders', roles: ['ADMIN', 'INVENTORY_MANAGER', 'WAREHOUSE_EMPLOYEE'] }
      ]
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

    this.setOpenedMenuByUrl(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setOpenedMenuByUrl(this.router.url);
      });
  }

  canShow(item: MenuItem): boolean {
    return item.roles.includes(this.userRole);
  }

  canShowChild(child: ChildMenuItem): boolean {
    return child.roles.includes(this.userRole);
  }

  getVisibleChildren(item: MenuItem): ChildMenuItem[] {
    return item.children?.filter(child => this.canShowChild(child)) || [];
  }

  getParentRoute(label: string): string {
    if (label === 'Product') return '/products';
    if (label === 'Category') return '/categories';
    if (label === 'Stock') return '/stock';
    if (label === 'Warehouses') return '/warehouses';
    if (label === 'Suppliers') return '/suppliers';
    if (label === 'Purchase Orders') return '/purchase-orders';
    if (label === 'Sales Orders') return '/sales-orders';

    return '/dashboard';
  }

  setOpenedMenuByUrl(url: string): void {
    if (url.startsWith('/products')) {
      this.openedMenu = 'Product';
      return;
    }

    if (url.startsWith('/categories')) {
      this.openedMenu = 'Category';
      return;
    }

    if (url.startsWith('/stock')) {
      this.openedMenu = 'Stock';
      return;
    }

    if (url.startsWith('/warehouses')) {
      this.openedMenu = 'Warehouses';
      return;
    }

    if (url.startsWith('/suppliers')) {
      this.openedMenu = 'Suppliers';
      return;
    }

    if (url.startsWith('/purchase-orders')) {
      this.openedMenu = 'Purchase Orders';
      return;
    }

    if (url.startsWith('/sales-orders')) {
      this.openedMenu = 'Sales Orders';
      return;
    }

    this.openedMenu = '';
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }

    this.router.navigate(['/login']);
  }
}