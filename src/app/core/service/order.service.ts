import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { ApiResponse } from '../model/api';
import { Paged } from '../model/paged';
import { Order, OrderToKitchen } from '../model/data/order';
import { API_CONSTANTS, buildUrl } from '../constant';
import { ServiceType } from '../enums/api-enums';
import {
  CreateDraftOrderRequest,
  CreateDraftOrderResponse,
} from '../model/order/create-draft-order';
import { UpdateOrderWithDetailsRequest } from '../model/order/update-order-with-details';
import { InvoiceDto } from '../model/data/invoice';
import { TodaySales } from '../model/order/today-sales';

@Injectable({
  providedIn: 'root',
})
export class OrderService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  createDraftOrder(
    request: CreateDraftOrderRequest
  ): Observable<ApiResponse<CreateDraftOrderResponse>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.ORDER.CONTROLLER,
      API_CONSTANTS.ORDER.CREATE_DRAFT_ORDER
    );

    return this.http
      .post<ApiResponse<CreateDraftOrderResponse>>(url, request)
      .pipe(catchError(this.handleError));
  }

  sendToKitchen(
    request: UpdateOrderWithDetailsRequest,
    orderId: number
  ): Observable<ApiResponse<void>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.ORDER.CONTROLLER,
      API_CONSTANTS.ORDER.SEND_TO_KITCHEN,
      {
        id: orderId.toString(),
      }
    );

    return this.http
      .put<ApiResponse<void>>(url, request)
      .pipe(catchError(this.handleError));
  }

  claimToCook(orderId: number): Observable<ApiResponse<void>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.ORDER.CONTROLLER,
      API_CONSTANTS.ORDER.CLAIM_TO_COOK,
      {
        id: orderId.toString(),
      }
    );

    return this.http
      .put<ApiResponse<void>>(url, null)
      .pipe(catchError(this.handleError));
  }

  markAsReady(orderId: number): Observable<ApiResponse<void>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.ORDER.CONTROLLER,
      API_CONSTANTS.ORDER.MARK_AS_READY,
      {
        id: orderId.toString(),
      }
    );

    return this.http
      .put<ApiResponse<void>>(url, null)
      .pipe(catchError(this.handleError));
  }

  getDishesToKitchen(
    page: number,
    size: number
  ): Observable<ApiResponse<Paged<OrderToKitchen>>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.ORDER.CONTROLLER,
      API_CONSTANTS.ORDER.GET_ORDERS_TO_KITCHEN
    );

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http
      .get<ApiResponse<Paged<OrderToKitchen>>>(url, {
        params,
      })
      .pipe(catchError(this.handleError));
  }
  getOrderByTableId(tableId: number): Observable<ApiResponse<Order>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.ORDER.CONTROLLER,
      API_CONSTANTS.ORDER.GET_ORDER_BY_TABLE_ID,
      {
        id: tableId.toString(),
      }
    );

    return this.http
      .get<ApiResponse<Order>>(url)
      .pipe(catchError(this.handleError));
  }

  markOrderServed(orderId: number): Observable<ApiResponse<void>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.ORDER.CONTROLLER,
      API_CONSTANTS.ORDER.MARK_SERVED,
      {
        id: orderId.toString(),
      }
    );

    return this.http
      .put<ApiResponse<void>>(url, null)
      .pipe(catchError(this.handleError));
  }

  getOrderAccount(orderId: number): Observable<ApiResponse<InvoiceDto>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.ORDER.CONTROLLER,
      API_CONSTANTS.ORDER.GET_ORDER_ACCOUNT,
      {
        id: orderId.toString(),
      }
    );

    return this.http
      .get<ApiResponse<InvoiceDto>>(url)
      .pipe(catchError(this.handleError));
  }

  payOrder(orderId: number): Observable<ApiResponse<void>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.ORDER.CONTROLLER,
      API_CONSTANTS.ORDER.PAY_ORDER,
      {
        id: orderId.toString(),
      }
    );

    return this.http
      .put<ApiResponse<void>>(url, null)
      .pipe(catchError(this.handleError));
  }

  markOrderIsFinalized(orderId: number): Observable<ApiResponse<void>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.ORDER.CONTROLLER,
      API_CONSTANTS.ORDER.MARK_ORDER_AS_FINALIZED,
      {
        id: orderId.toString(),
      }
    );

    return this.http
      .put<ApiResponse<void>>(url, null)
      .pipe(catchError(this.handleError));
  }

  getTodaySales(): Observable<ApiResponse<TodaySales>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.ORDER.CONTROLLER,
      API_CONSTANTS.ORDER.GET_TODAY_SALES
    );

    return this.http
      .get<ApiResponse<TodaySales>>(url)
      .pipe(catchError(this.handleError));
  }
}
