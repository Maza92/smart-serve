import { Routes } from '@angular/router';
import { CreateSupplierComponent } from '@app/components/inventory/suppliers/suppliers/create-supplier/create-supplier.component';
import { SupplierDetailComponent } from '@app/components/inventory/suppliers/suppliers/supplier-detail/supplier-detail.component';
import { SuppliersComponent } from '@app/components/inventory/suppliers/suppliers/suppliers.component';
import { InventoryComponent } from '@app/pages/inventory/inventory.component';
import { itemsRoutes } from './inventory/items.routes';

export const inventoryRoutes: Routes = [
  {
    path: 'inventory',
    children: [
      {
        path: '',
        component: InventoryComponent,
      },
      {
        path: 'suppliers',
        children: [
          {
            path: '',
            component: SuppliersComponent,
          },
          {
            path: 'create',
            component: CreateSupplierComponent,
          },
          {
            path: 'details/:id',
            component: SupplierDetailComponent,
          },
        ],
      },
      ...itemsRoutes,
    ],
  },
];
