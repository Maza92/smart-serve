import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import {
  ReportDashboard,
  SalesOverview,
  SalesSummary,
  DishPerformance,
  PaymentMethodDistribution,
} from '../model/data/report-dashboard';
import { API_CONSTANTS, buildUrl } from '../constant';
import { ServiceType } from '../enums/api-enums';
import { ApiResponse } from '../model/api';
import {
  ProductSalesReport,
  SalesReportFilters,
  WaiterPerformance,
} from '../model/report/product-sale-report';
import { Paged, PagedSalesReport } from '../model/paged';

@Injectable({
  providedIn: 'root',
})
export class ReportService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getDashboard(
    startDate: string,
    endDate: string
  ): Observable<ApiResponse<ReportDashboard>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.REPORT.CONTROLLER,
      API_CONSTANTS.REPORT.GET_DASHBOARD
    );

    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http
      .get<ApiResponse<ReportDashboard>>(url, {
        params,
      })
      .pipe(catchError(this.handleError));
  }

  getSalesOverview(
    startDate: string,
    endDate: string
  ): Observable<ApiResponse<SalesOverview>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.REPORT.CONTROLLER,
      API_CONSTANTS.REPORT.GET_SALES_OVERVIEW
    );

    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http
      .get<ApiResponse<SalesOverview>>(url, {
        params,
      })
      .pipe(catchError(this.handleError));
  }

  getSalesSummary(
    startDate: string,
    endDate: string
  ): Observable<ApiResponse<SalesSummary>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.REPORT.CONTROLLER,
      API_CONSTANTS.REPORT.GET_SALES_SUMMARY
    );

    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http
      .get<ApiResponse<SalesSummary>>(url, {
        params,
      })
      .pipe(catchError(this.handleError));
  }

  getDishPerformance(
    startDate: string,
    endDate: string,
    limit: number
  ): Observable<ApiResponse<DishPerformance>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.REPORT.CONTROLLER,
      API_CONSTANTS.REPORT.GET_DISH_PERFORMANCE
    );

    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate)
      .set('limit', limit.toString());

    return this.http
      .get<ApiResponse<DishPerformance>>(url, {
        params,
      })
      .pipe(catchError(this.handleError));
  }

  getPaymentMethodDistribution(
    startDate: string,
    endDate: string
  ): Observable<ApiResponse<PaymentMethodDistribution>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.REPORT.CONTROLLER,
      API_CONSTANTS.REPORT.GET_PAYMENT_METHOD_DISTRIBUTION
    );

    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http
      .get<ApiResponse<PaymentMethodDistribution>>(url, {
        params,
      })
      .pipe(catchError(this.handleError));
  }

  getProductSalesReport(
    page: number,
    size: number,
    filters: SalesReportFilters
  ): Observable<ApiResponse<PagedSalesReport<ProductSalesReport>>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.REPORT.CONTROLLER,
      API_CONSTANTS.REPORT.GET_PRODUCT_SALES_REPORT
    );

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value as string);
        }
      });
    }

    return this.http
      .get<ApiResponse<PagedSalesReport<ProductSalesReport>>>(url, {
        params,
      })
      .pipe(catchError(this.handleError));
  }

  getWaiterPerformanceReport(
    page: number,
    size: number,
    filters: SalesReportFilters
  ): Observable<ApiResponse<PagedSalesReport<WaiterPerformance>>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.REPORT.CONTROLLER,
      API_CONSTANTS.REPORT.GET_WAITER_PERFORMANCE_REPORT
    );

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value as string);
        }
      });
    }

    return this.http
      .get<ApiResponse<PagedSalesReport<WaiterPerformance>>>(url, {
        params,
      })
      .pipe(catchError(this.handleError));
  }

  getTopWaitersReport(
    filters: SalesReportFilters
  ): Observable<ApiResponse<ProductSalesReport[]>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.REPORT.CONTROLLER,
      API_CONSTANTS.REPORT.GET_TOP_WAITERS_REPORT
    );

    let params = new HttpParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value as string);
        }
      });
    }

    return this.http
      .get<ApiResponse<ProductSalesReport[]>>(url, {
        params,
      })
      .pipe(catchError(this.handleError));
  }
}
