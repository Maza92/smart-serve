import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { catchError, Observable } from 'rxjs';
import { ApiResponse } from '../model/api';
import { Paged } from '../model/paged';
import { CashMovement } from '../model/data/cash-movement';
import { API_CONSTANTS, buildUrl } from '../constant';
import { ServiceType } from '../enums/api-enums';
import { CashMovementFilterOptions } from '../model/filter-options';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CreateCashMovementRequest } from '../model/cash-movement/create-cash-movement-request';

@Injectable({
  providedIn: 'root',
})
export class CashMovementService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getCashMovements(
    page: number,
    pageSize: number,
    filters?: CashMovementFilterOptions
  ): Observable<ApiResponse<Paged<CashMovement>>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.CASH_MOVEMENT.CONTROLLER,
      API_CONSTANTS.CASH_MOVEMENT.GET_MOVEMENTS
    );

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', pageSize.toString());

    if (filters) {
      params = Object.entries(filters).reduce((acc, [key, value]) => {
        return value ? acc.set(key, String(value)) : acc;
      }, params);
    }

    return this.http
      .get<ApiResponse<Paged<CashMovement>>>(url, {
        params,
      })
      .pipe(catchError(this.handleError));
  }

  getCashMovementById(id: number): Observable<ApiResponse<CashMovement>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.CASH_MOVEMENT.CONTROLLER,
      API_CONSTANTS.CASH_MOVEMENT.GET_MOVEMENT,
      { id: id.toString() }
    );

    return this.http
      .get<ApiResponse<CashMovement>>(url)
      .pipe(catchError(this.handleError));
  }

  createCashMovement(
    request: CreateCashMovementRequest
  ): Observable<ApiResponse<CashMovement>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.CASH_MOVEMENT.CONTROLLER,
      API_CONSTANTS.CASH_MOVEMENT.CREATE_MOVEMENT
    );

    return this.http
      .post<ApiResponse<CashMovement>>(url, request)
      .pipe(catchError(this.handleError));
  }

  deleteCashMovement(id: number): Observable<ApiResponse<void>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.CASH_MOVEMENT.CONTROLLER,
      API_CONSTANTS.CASH_MOVEMENT.DELETE_MOVEMENT,
      { id: id.toString() }
    );

    return this.http
      .delete<ApiResponse<void>>(url)
      .pipe(catchError(this.handleError));
  }
}
