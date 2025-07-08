import { PaymentMethodEnum } from '@app/core/enums/transaction-enums';

export interface CreateOrderTransactionRequest {
  orderId: number;
  amount: number;
  paymentMethod: PaymentMethodEnum;
  referenceNumber?: string;
  paymentDetails?: { [key: string]: any };
}
