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
        path: 'order',
        component: OrderComponent,
      },
      {
        path: 'tables',
        component: TablesComponent,
      },
      {
        path: 'kitchen',
        component: KitchenComponent,
      },
    ],
  },
];
