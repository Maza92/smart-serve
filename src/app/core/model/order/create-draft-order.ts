import { OrderStatusEnum } from '@app/core/enums/order-enum';

export interface CreateDraftOrderRequest {
  tableId: number;
  guestsCount: number;
}

export interface CreateDraftOrderResponse {
  orderId: number;
  status: OrderStatusEnum;
  tableId: number;
  createdAt: string;
}
