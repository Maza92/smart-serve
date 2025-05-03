import { Routes } from '@angular/router';
import { ComponentsComponent } from './pages/components/components.page';

export const routes: Routes = [
  {
    path: 'components',
    component: ComponentsComponent,
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
