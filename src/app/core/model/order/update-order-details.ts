import { OrderModification } from './modifications';

export interface UpdateOrderDetailsRequest {
  dishId: number;
  quantity: number;
  modifications: OrderModification[];
}
