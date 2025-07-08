import { Routes } from '@angular/router';
import { DishesCreateComponent } from '@app/components/settings/dishes/dishes-create/dishes-create.component';
import { DishesComponent } from '@app/components/settings/dishes/dishes.component';
import { EditDishComponent } from '@app/components/settings/dishes/edit-dish/edit-dish.component';
import { SessionsComponent } from '@app/components/settings/sessions/sessions.component';
import { TableComponent } from '@app/components/settings/table/table.component';
import { UserEditComponent } from '@app/components/settings/users/user-edit/user-edit.component';
import { UsersComponent } from '@app/components/settings/users/users.component';
import { AuthGuard } from '@app/core/guard/auth.guard';
import { SettingsComponent } from '@app/pages/settings/settings.component';

export const settingsRoutes: Routes = [
  {
    path: 'settings',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: SettingsComponent,
      },
      {
        path: 'sessions',
        component: SessionsComponent,
      },
      {
        path: 'users',
        children: [
          {
            path: '',
            component: UsersComponent,
          },
          {
            path: 'edit/:id',
            component: UserEditComponent,
          },
        ],
      },
      {
        path: 'user',
        component: UserEditComponent,
      },
      {
        path: 'table',
        component: TableComponent,
      },
      {
        path: 'dishes',
        children: [
          {
            path: '',
            component: DishesComponent,
          },
          {
            path: 'create',
            component: DishesCreateComponent,
          },
          {
            path: 'edit/:id',
            component: EditDishComponent,
          },
        ],
      },
    ],
  },
];
