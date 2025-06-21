import { Routes } from '@angular/router';
import { ItemDetailsComponent } from '@app/components/inventory/items/item-details/item-details.component';
import { ItemsComponent } from '@app/components/inventory/items/items.component';
import { ManualRegisterComponent } from '@app/components/inventory/movement/manual-register/manual-register.component';
import { MovementComponent } from '@app/components/inventory/movement/movement.component';
import { ShopRegisterComponent } from '@app/components/inventory/movement/shop-register/shop-register.component';
import { WasteRegisterComponent } from '@app/components/inventory/movement/waste-register/waste-register.component';

export const itemsRoutes: Routes = [
  {
    path: 'items',
    children: [
      {
        path: '',
        component: ItemsComponent,
      },
      {
        path: 'details/:id',
        component: ItemDetailsComponent,
      },
      {
        path: 'movements',
        children: [
          {
            path: '',
            component: MovementComponent,
          },
          {
            path: 'shop',
            component: ShopRegisterComponent,
          },
          {
            path: 'waste',
            component: WasteRegisterComponent,
          },
          {
            path: 'manual',
            component: ManualRegisterComponent,
          },
        ],
      },
    ],
  },
];
