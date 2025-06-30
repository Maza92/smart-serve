import { OrderServiceType } from '@app/core/enums/order-enum';
import { UpdateOrderDetailsRequest } from './update-order-details';

export interface UpdateOrderWithDetailsRequest {
  customerName: string;
  serviceType: OrderServiceType;
  comments: string;
  details: UpdateOrderDetailsRequest[];
}
