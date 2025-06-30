import { Routes } from '@angular/router';
import { CashRegisterComponent } from '@app/components/cash-register/cash-register.component';
import { KitchenComponent } from '@app/components/pos/kitchen/kitchen.component';
import { OrderComponent } from '@app/components/pos/order/order.component';
import { SalesComponent } from '@app/components/pos/sales/sales.component';
import { TablesComponent } from '@app/components/pos/tables/tables.component';
import { PosComponent } from '@app/pages/pos/pos.component';

export const posRoutes: Routes = [
  {
    path: 'pos',
    children: [
      {
        path: '',
        component: PosComponent,
      },
      {
        path: 'cash-register',
        component: CashRegisterComponent,
      },
      {
        path: 'sales',
        component: SalesComponent,
      },
      {
        path: 'tables',
        children: [
          {
            path: '',
            component: TablesComponent,
          },
          {
            path: 'menu',
            children: [
              {
                path: '',
                component: SalesComponent,
              },
              {
                path: 'order',
                component: OrderComponent,
              },
            ],
          },
        ],
      },
      {
        path: 'kitchen',
        component: KitchenComponent,
      },
    ],
  },
];
