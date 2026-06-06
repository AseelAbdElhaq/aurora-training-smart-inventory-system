import { Routes } from '@angular/router';

import { MainLayoutComponent } from './Layout/main-layout/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { Login } from './pages/login/login.component';

export const routes: Routes = [
  {
    path: 'login',
    component: Login
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];