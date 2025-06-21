import { Routes } from '@angular/router';
import { ComponentsComponent } from './pages/components/components.page';
import { AuthGuard } from './core/guard/auth.guard';
import { LoginGuard } from './core/guard/login.guard';
import { authRoutes } from './routes/auth.routes';
import { StarterComponent } from './pages/starter/starter.page';
import { homeRoutes } from './routes/home.routes';
import { privRoutes } from './routes/priv.routes';
import { settingsRoutes } from './routes/settings.routes';

export const routes: Routes = [
  {
    path: 'components',
    component: ComponentsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'starter',
    component: StarterComponent,
    canActivate: [LoginGuard],
  },
  ...authRoutes,
  ...homeRoutes,
  ...privRoutes,
  ...settingsRoutes,
  { path: '**', redirectTo: 'starter' },
];
