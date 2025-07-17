import { SalesReportSummary } from './report/product-sale-report';

export interface Paged<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface PagedSalesReport<T> {
  content: Paged<T>;
  summary: SalesReportSummary;
}
