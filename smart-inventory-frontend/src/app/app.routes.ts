import { Routes, CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { LoginComponent } from './pages/login/login.component';
import { MainLayoutComponent } from './Layout/main-layout/main-layout.component';

import { DashboardComponent } from './pages/dashboard/dashboard';

import { ProductListComponent } from './pages/products/product-list/product-list.component';
import { ProductFormComponent } from './pages/products/product-form/product-form.component';
import { ProductDetailsComponent } from './pages/products/product-details/product-details.component';

import { CategoryListComponent } from './pages/categories/category-list.component';
import { CategoryFormComponent } from './pages/categories/category-form.component';

import { PurchaseOrderFormComponent } from './pages/purchase-orders/purchase-order-form/purchase-order-form.component';
import { PurchaseOrderListComponent } from './pages/purchase-orders/purchase-order-list/purchase-order-list.component';
import { PurchaseOrderDetailsComponent } from './pages/purchase-orders/purchase-order-details/purchase-order-details.component';

import { SalesOrderListComponent } from './pages/sales-orders/sales-order-list/sales-order-list.component';
import { SalesOrderFormComponent } from './pages/sales-orders/sales-order-form/sales-order-form.component';

type Role =
  | 'ADMIN'
  | 'INVENTORY_MANAGER'
  | 'PURCHASING_MANAGER'
  | 'WAREHOUSE_EMPLOYEE';

const roleGuard = (allowedRoles: Role[]): CanActivateFn => {
  return () => {
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    if (!isPlatformBrowser(platformId)) {
      return true;
    }

    const savedRole = localStorage.getItem('role');
    const role = savedRole?.trim().toUpperCase().replace('ROLE_', '') as Role | null;

    if (!role) {
      router.navigate(['/login']);
      return false;
    }

    if (allowedRoles.includes(role)) {
      return true;
    }

    alert('Access denied. You are not allowed to open this page.');
    router.navigate(['/dashboard']);
    return false;
  };
};

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: '',
    component: MainLayoutComponent,

    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [roleGuard(['ADMIN', 'INVENTORY_MANAGER', 'PURCHASING_MANAGER', 'WAREHOUSE_EMPLOYEE'])]
      },

      {
        path: 'products',
        component: ProductListComponent,
        canActivate: [roleGuard(['ADMIN', 'INVENTORY_MANAGER', 'PURCHASING_MANAGER', 'WAREHOUSE_EMPLOYEE'])],
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'products/add',
        component: ProductFormComponent,
        canActivate: [roleGuard(['ADMIN', 'INVENTORY_MANAGER'])]
      },
      {
        path: 'products/edit/:id',
        component: ProductFormComponent,
        canActivate: [roleGuard(['ADMIN', 'INVENTORY_MANAGER'])]
      },
      {
        path: 'products/details/:id',
        component: ProductDetailsComponent,
        canActivate: [roleGuard(['ADMIN', 'INVENTORY_MANAGER', 'PURCHASING_MANAGER', 'WAREHOUSE_EMPLOYEE'])]
      },

      {
        path: 'categories',
        component: CategoryListComponent,
        canActivate: [roleGuard(['ADMIN', 'INVENTORY_MANAGER'])],
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'categories/add',
        component: CategoryFormComponent,
        canActivate: [roleGuard(['ADMIN', 'INVENTORY_MANAGER'])]
      },
      {
        path: 'categories/edit/:id',
        component: CategoryFormComponent,
        canActivate: [roleGuard(['ADMIN', 'INVENTORY_MANAGER'])]
      },

      {
        path: 'warehouses',
        loadComponent: () =>
          import('./pages/warehouses/warehouse-list/warehouse-list.component')
            .then(m => m.WarehouseListComponent),
        canActivate: [roleGuard(['ADMIN', 'INVENTORY_MANAGER', 'PURCHASING_MANAGER', 'WAREHOUSE_EMPLOYEE'])],
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'warehouses/add',
        loadComponent: () =>
          import('./pages/warehouses/warehouse-form/warehouse-form.component')
            .then(m => m.WarehouseFormComponent),
        canActivate: [roleGuard(['ADMIN', 'INVENTORY_MANAGER'])]
      },
      {
        path: 'warehouses/edit/:id',
        loadComponent: () =>
          import('./pages/warehouses/warehouse-form/warehouse-form.component')
            .then(m => m.WarehouseFormComponent),
        canActivate: [roleGuard(['ADMIN', 'INVENTORY_MANAGER'])]
      },

      {
        path: 'stock',
        loadComponent: () =>
          import('./pages/stock/stock-list/stock-list.component')
            .then(m => m.StockListComponent),
        canActivate: [roleGuard(['ADMIN', 'INVENTORY_MANAGER', 'WAREHOUSE_EMPLOYEE'])],
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'stock/add',
        loadComponent: () =>
          import('./pages/stock/stock-form/stock-form.component')
            .then(m => m.StockFormComponent),
        canActivate: [roleGuard(['ADMIN', 'INVENTORY_MANAGER', 'WAREHOUSE_EMPLOYEE'])]
      },
      {
        path: 'stock/edit/:id',
        loadComponent: () =>
          import('./pages/stock/stock-form/stock-form.component')
            .then(m => m.StockFormComponent),
        canActivate: [roleGuard(['ADMIN', 'INVENTORY_MANAGER', 'WAREHOUSE_EMPLOYEE'])]
      },
      {
        path: 'stock/transfer',
        loadComponent: () =>
          import('./pages/stock/stock-transfer/stock-transfer.component')
            .then(m => m.StockTransferComponent),
        canActivate: [roleGuard(['ADMIN', 'INVENTORY_MANAGER'])]
      },

      {
        path: 'purchase-orders',
        component: PurchaseOrderListComponent,
        canActivate: [roleGuard(['ADMIN', 'INVENTORY_MANAGER', 'PURCHASING_MANAGER'])]
      },
      {
        path: 'purchase-orders/add',
        component: PurchaseOrderFormComponent,
        canActivate: [roleGuard(['ADMIN', 'INVENTORY_MANAGER', 'PURCHASING_MANAGER'])]
      },
      {
        path: 'purchase-orders/edit/:id',
        component: PurchaseOrderFormComponent,
        canActivate: [roleGuard(['ADMIN', 'INVENTORY_MANAGER', 'PURCHASING_MANAGER'])]
      },
      {
        path: 'purchase-orders/details/:id',
        component: PurchaseOrderDetailsComponent,
        canActivate: [roleGuard(['ADMIN', 'INVENTORY_MANAGER', 'PURCHASING_MANAGER'])]
      },

      {
        path: 'sales-orders',
        component: SalesOrderListComponent,
        canActivate: [roleGuard(['ADMIN', 'INVENTORY_MANAGER', 'WAREHOUSE_EMPLOYEE'])]
      },
      {
        path: 'sales-orders/add',
        component: SalesOrderFormComponent,
        canActivate: [roleGuard(['ADMIN', 'INVENTORY_MANAGER'])]
      },
      {
        path: 'sales-orders/edit/:id',
        component: SalesOrderFormComponent,
        canActivate: [roleGuard(['ADMIN', 'INVENTORY_MANAGER'])]
      },

      {
        path: 'suppliers',
        loadComponent: () =>
          import('./pages/suppliers/supplier-list/supplier-list.component')
            .then(m => m.SupplierListComponent),
        canActivate: [roleGuard(['ADMIN', 'PURCHASING_MANAGER'])],
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'suppliers/add',
        loadComponent: () =>
          import('./pages/suppliers/supplier-form/supplier-form.component')
            .then(m => m.SupplierFormComponent),
        canActivate: [roleGuard(['ADMIN', 'PURCHASING_MANAGER'])]
      },
      {
        path: 'suppliers/edit/:id',
        loadComponent: () =>
          import('./pages/suppliers/supplier-form/supplier-form.component')
            .then(m => m.SupplierFormComponent),
        canActivate: [roleGuard(['ADMIN', 'PURCHASING_MANAGER'])]
      },

      {
        path: 'users',
        loadComponent: () =>
          import('./pages/users/user-list/user-list.component')
            .then(m => m.UserListComponent),
        canActivate: [roleGuard(['ADMIN'])],
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'users/add',
        loadComponent: () =>
          import('./pages/users/user-form/user-form.component')
            .then(m => m.UserFormComponent),
        canActivate: [roleGuard(['ADMIN'])]
      },
      {
        path: 'users/edit/:id',
        loadComponent: () =>
          import('./pages/users/user-form/user-form.component')
            .then(m => m.UserFormComponent),
        canActivate: [roleGuard(['ADMIN'])]
      },{
  path: 'alerts',
  loadComponent: () =>
    import('./pages/alerts/alert-list/alert-list.component')
      .then(m => m.AlertListComponent),
  canActivate: [roleGuard(['ADMIN', 'INVENTORY_MANAGER', 'PURCHASING_MANAGER', 'WAREHOUSE_EMPLOYEE'])]
},
{
  path: 'reports',
  loadComponent: () =>
    import('./pages/reports/report-list/report-list.component')
      .then(m => m.ReportListComponent),
  canActivate: [roleGuard(['ADMIN', 'INVENTORY_MANAGER', 'PURCHASING_MANAGER'])]
},
{
  path: 'ai-insights',
  loadComponent: () =>
    import('./pages/ai-insights/ai-insight-list/ai-insight-list.component')
      .then(m => m.AiInsightListComponent),
  canActivate: [roleGuard(['ADMIN', 'INVENTORY_MANAGER', 'PURCHASING_MANAGER'])]
},
    ]
  },

  {
    path: '**',
    redirectTo: 'dashboard'
  }
];