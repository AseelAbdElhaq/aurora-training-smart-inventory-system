import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { MainLayoutComponent } from './Layout/main-layout/main-layout.component';

import { DashboardComponent } from './pages/dashboard/dashboard';

import { ProductListComponent } from './pages/products/product-list/product-list.component';
import { ProductFormComponent } from './pages/products/product-form/product-form.component';
import { ProductDetailsComponent } from './pages/products/product-details/product-details.component';

import { CategoryListComponent } from './pages/categories/category-list.component';
import { CategoryFormComponent } from './pages/categories/category-form.component';

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
        path: 'products',
        component: ProductListComponent
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
        component: CategoryListComponent
      },
      {
        path: 'categories/add',
        component: CategoryFormComponent
      },
      {
        path: 'categories/edit/:id',
        component: CategoryFormComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];