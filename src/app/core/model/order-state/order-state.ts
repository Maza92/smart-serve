import { OrderServiceType } from '@app/core/enums/order-enum';
import { Dish } from '../data/dish';
import { UpdateOrderDetailsRequest } from '../order/update-order-details';

export interface OrderItem extends UpdateOrderDetailsRequest {
  dish: Dish;
}

export interface OrderState {
  orderId: number | null;
  customerName: string;
  serviceType: OrderServiceType;
  comments: string;
  items: OrderItem[];
}

export const initialState: OrderState = {
  orderId: null,
  customerName: '',
  serviceType: OrderServiceType.DINE_IN,
  comments: '',
  items: [],
};
