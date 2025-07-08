import {
  PaymentMethodEnum,
  TransactionStatusEnum,
  TransactionTypeEnum,
} from '@app/core/enums/transaction-enums';

export interface CreateTransactionRequest {
  cashRegisterId: number;
  orderId?: number;
  amount: number;
  paymentMethod: PaymentMethodEnum;
  transactionType: TransactionTypeEnum;
  referenceNumber?: string;
  status: TransactionStatusEnum;
  paymentDetails?: { [key: string]: any };
}
