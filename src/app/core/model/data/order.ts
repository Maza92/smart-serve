import { OrderServiceType, OrderStatusEnum } from '@app/core/enums/order-enum';
import { OrderDetails, OrderDetailsToKitchen } from './order-details';

export interface Order {
  id: number;
  userId: number;
  userName: string;
  tableNumber: number;
  status: OrderStatusEnum;
  totalPrice: number;
  comments: string;
  serviceType: OrderServiceType;
  taxAmount: number;
  discountAmount: number;
  customerName: string;
  guestsCount: number;
  tableId: number;
  createdAt: string;
  orderDetails: OrderDetails[];
}

export interface OrderToKitchen {
  id: number;
  tableNumber: number;
  status: OrderStatusEnum;
  customerName: string;
  waiterName: string;
  sentToKitchenAt: string;
  orderDetails: OrderDetailsToKitchen[];
}
