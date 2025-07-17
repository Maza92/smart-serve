import { OrderModification } from '../order/modifications';

export interface OrderDetails {
  id: number;
  dishId: number;
  dishName: string;
  quantity: number;
  unitPrice: number;
  finalPrice: number;
  status: string;
  preparedAt: string;
}

export interface OrderDetailsToKitchen {
  id: number;
  quantity: number;
  dishName: string;
  categoryName: string;
  estimatedPreparationTime: string;
  modifications: OrderModification[];
}
