import {
  PaymentMethodEnum,
  TransactionStatusEnum,
  TransactionTypeEnum,
} from '@app/core/enums/transaction-enums';

export interface Transaction {
  id?: number;
  cashRegisterId?: number;
  cashRegisterStatus?: string;
  orderId?: number;
  orderNumber?: string;
  amount?: number;
  paymentMethod?: PaymentMethodEnum;
  transactionType?: TransactionTypeEnum;
  referenceNumber?: string;
  status?: TransactionStatusEnum;
  paymentDetails?: Record<string, any>;
  transactionDate?: string;
  username?: string;
  createdAt?: string;
  updatedAt?: string;
  active?: boolean;
}
