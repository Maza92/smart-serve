import { OrderModification } from '../order/modifications';

export interface OrderDetails {}

export interface OrderDetailsToKitchen {
  id: number;
  quantity: number;
  dishName: string;
  categoryName: string;
  estimatedPreparationTime: string;
  modifications: OrderModification[];
}
