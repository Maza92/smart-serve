import { Routes } from '@angular/router';
import { ComponentsComponent } from './pages/components/components.page';

export const routes: Routes = [
  {
    path: 'components',
    component: ComponentsComponent,
  },
  {
    path: 'starter',
    loadComponent: () =>
      import('./pages/starter/starter.page').then((m) => m.StarterComponent),
  },
  {
    path: 'home',
    loadComponent: () =>
      import(
        './layout/navigation-bar-layout/navigation-bar-layout.component'
      ).then((m) => m.NavigationBarLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home.component').then((m) => m.HomeComponent),
      },
    ],
  },
  {
    path: 'home/nobar',
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
