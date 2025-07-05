import { Routes } from '@angular/router';
import { CashMovementsComponent } from '@app/components/cash-register/cash-movements/cash-movements.component';
import { CashRegisterComponent } from '@app/components/cash-register/cash-register.component';
import { InvoiceComponent } from '@app/components/pos/invoice/invoice.component';
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
        children: [
          {
            path: '',
            component: CashRegisterComponent,
          },
          {
            path: 'cash-movements',
            component: CashMovementsComponent,
          },
        ],
      },
      {
        path: 'sales',
        component: SalesComponent,
      },
      {
        path: 'invoice/:id',
        component: InvoiceComponent,
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
