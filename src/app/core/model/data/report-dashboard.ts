import { PaymentMethodEnum } from '@app/core/enums/transaction-enums';

export interface ReportDashboard {
  salesOverview: SalesOverview;
  salesSummary: SalesSummary;
  dishPerformance: DishPerformance;
  paymentMethodDistribution: PaymentMethodDistribution;
  startDate: string;
  endDate: string;
}

export interface SalesOverview {
  labels: string[];
  values: number[];
  minValue: number;
  maxValue: number;
}

export interface SalesSummary {
  totalTransactions: number;
  totalRevenue: number;
  averageTicket: number;
}

export interface DishPerformance {
  dishNames: string[];
  quantities: number[];
  totalDishesAnalyzed: number;
  isLimited: boolean;
}

export interface PaymentMethodDistribution {
  paymentMethods: PaymentMethodEnum[];
  percentages: number[];
  totalAmount: number;
}
