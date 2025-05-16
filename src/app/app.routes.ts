import { Routes } from '@angular/router';
import { ComponentsComponent } from './pages/components/components.page';
import { AuthGuard } from './core/guard/auth.guard';
import { LoginGuard } from './core/guard/login.guard';

export const routes: Routes = [
  {
    path: 'components',
    component: ComponentsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'starter',
    loadComponent: () =>
      import('./pages/starter/starter.page').then((m) => m.StarterComponent),
    canActivate: [LoginGuard],
  },
  {
    path: 'home',
    loadComponent: () =>
      import(
        './layout/navigation-bar-layout/navigation-bar-layout.component'
      ).then((m) => m.NavigationBarLayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'pos',
        loadComponent: () =>
          import('./pages/pos/pos.component').then((m) => m.PosComponent),
      },
    ],
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/settings/settings.component').then(
            (m) => m.SettingsComponent
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./components/settings/users/users.component').then(
            (m) => m.UsersComponent
          ),
      },
      {
        path: 'users/:id',
        loadComponent: () =>
          import(
            './components/settings/users/user-edit/user-edit.component'
          ).then((m) => m.UserEditComponent),
      },
    ],
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
    canActivate: [LoginGuard],
  },
  {
    path: '**',
    redirectTo: 'starter',
  },
];
