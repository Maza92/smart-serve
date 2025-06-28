import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { ApiResponse } from '../model/api';
import { Paged } from '../model/paged';
import { OrderToKitchen } from '../model/data/order';
import { API_CONSTANTS, buildUrl } from '../constant';
import { ServiceType } from '../enums/api-enums';

@Injectable({
  providedIn: 'root',
})
export class OrderService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  sendToKitchen(orderId: number): Observable<ApiResponse<void>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.ORDER.CONTROLLER,
      API_CONSTANTS.ORDER.SEND_TO_KITCHEN,
      {
        id: orderId.toString(),
      }
    );

    return this.http
      .put<ApiResponse<void>>(url, null)
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
}
