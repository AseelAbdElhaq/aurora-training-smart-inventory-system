import { Routes } from '@angular/router';

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
        component: DashboardComponent
      },

      {
        path: 'products',
        component: ProductListComponent,
        runGuardsAndResolvers: 'always'
      },

      {
        path: 'products/add',
        component: ProductFormComponent
      },

      {
        path: 'products/edit/:id',
        component: ProductFormComponent
      },

      {
        path: 'products/details/:id',
        component: ProductDetailsComponent
      },

      {
        path: 'categories',
        component: CategoryListComponent,
        runGuardsAndResolvers: 'always'
      },

      {
        path: 'categories/add',
        component: CategoryFormComponent
      },

      {
        path: 'categories/edit/:id',
        component: CategoryFormComponent
      },

      {
        path: 'warehouses',
        loadComponent: () =>
          import('./pages/warehouses/warehouse-list/warehouse-list.component')
            .then(m => m.WarehouseListComponent),
        runGuardsAndResolvers: 'always'
      },

      {
        path: 'warehouses/add',
        loadComponent: () =>
          import('./pages/warehouses/warehouse-form/warehouse-form.component')
            .then(m => m.WarehouseFormComponent)
      },

      {
        path: 'warehouses/edit/:id',
        loadComponent: () =>
          import('./pages/warehouses/warehouse-form/warehouse-form.component')
            .then(m => m.WarehouseFormComponent)
      },

      {
        path: 'stock',
        loadComponent: () =>
          import('./pages/stock/stock-list/stock-list.component')
            .then(m => m.StockListComponent),
        runGuardsAndResolvers: 'always'
      },

      {
        path: 'stock/add',
        loadComponent: () =>
          import('./pages/stock/stock-form/stock-form.component')
            .then(m => m.StockFormComponent)
      },

      {
        path: 'stock/edit/:id',
        loadComponent: () =>
          import('./pages/stock/stock-form/stock-form.component')
            .then(m => m.StockFormComponent)
      },
      {
        path: 'purchase-orders',
        component: PurchaseOrderListComponent
      },
      {
        path: 'purchase-orders/add',
        component: PurchaseOrderFormComponent
      },
      {
        path: 'purchase-orders/edit/:id',
        component: PurchaseOrderFormComponent
      },
      {
        path: 'purchase-orders/details/:id',
        component: PurchaseOrderDetailsComponent
      },
      {
        path: 'stock/transfer',
        loadComponent: () =>
          import('./pages/stock/stock-transfer/stock-transfer.component')
            .then(m => m.StockTransferComponent)
      },

      {
        path: 'suppliers',
        loadComponent: () =>
          import('./pages/suppliers/supplier-list/supplier-list.component')
            .then(m => m.SupplierListComponent),
        runGuardsAndResolvers: 'always'
      },

      {
        path: 'suppliers/add',
        loadComponent: () =>
          import('./pages/suppliers/supplier-form/supplier-form.component')
            .then(m => m.SupplierFormComponent)
      },

      {
        path: 'suppliers/edit/:id',
        loadComponent: () =>
          import('./pages/suppliers/supplier-form/supplier-form.component')
            .then(m => m.SupplierFormComponent)
      },

    ]
  },

  {
    path: '**',
    redirectTo: 'dashboard'
  }
];