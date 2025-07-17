import { Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';
import { NavigationBarLayoutComponent } from '@app/layout/navigation-bar-layout/navigation-bar-layout.component';
import { AuthGuard } from '@app/core/guard/auth.guard';
import { inventoryRoutes } from './home/inventory.routes';
import { itemsRoutes } from './home/inventory/items.routes';
import { posRoutes } from './home/pos.routes';
import { reportRoutes } from './home/report.routes';

export const homeRoutes: Routes = [
  {
    path: 'home',
    component: NavigationBarLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      ...inventoryRoutes,
      ...posRoutes,
      ...reportRoutes,
    ],
  },
];
