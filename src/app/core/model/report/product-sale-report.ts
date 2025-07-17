export interface ProductSalesReport {
  dishId: number;
  dishName: string;
  categoryName: string;
  quantitySold: number;
  totalRevenue: number;
  totalCost: number;
  margin: number;
  marginPercentage: number;
  imageUrl: string;
}

export interface WaiterPerformance {
  waiterId: number;
  firstName: string;
  lastName: string;
  totalOrders: number;
  totalRevenue: number;
  averageTicket: number;
  profileImagePath: string;
}

export interface SalesChart {
  labels: string[];
  values: number[];
  orderCounts: number[];
}

export interface SalesReportSummary {
  totalRevenue: number;
  totalOrders: number;
  averageTicket: number;
  totalDiscount: number;
  totalTax: number;
  totalCost: number;
  totalMargin: number;
  marginPercentage: number;
  totalCustomers: number;
  periodStart: string; // ISO date string
  periodEnd: string; // ISO date string
}

export interface SalesReportFilters {
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  categoryId?: number;
  waiterId?: number;
  serviceType?: string;
  temporalGrouping?: 'DAY' | 'WEEK' | 'MONTH' | 'HOUR' | 'DAY_OF_WEEK';
  orderStatus?: string;
  tableNumber?: number;
}
