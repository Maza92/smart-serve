import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_CONSTANTS, buildUrl } from '../constant';
import { catchError, Observable } from 'rxjs';
import { ApiResponse } from '../model/api';
import { Paged } from '../model/paged';
import { CashRegister } from '../model/data/cash-register';
import { OpenCashRegisterRequest } from '../model/cash/open-cash-register-request';
import { CloseCashRegisterRequest } from '../model/cash/close-cash-register-request';
import { CreateCashRegisterRequest } from '../model/cash/create-cash-register-request';
import { ServiceType } from '../enums/api-enums';

@Injectable({
  providedIn: 'root',
})
export class CashRegisterService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getCashRegisters(
    page: number,
    pageSize: number
  ): Observable<ApiResponse<Paged<CashRegister>>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.CASH.CONTROLLER,
      API_CONSTANTS.CASH.GET_CASH_REGISTERS
    );

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', pageSize.toString());

    return this.http
      .get<ApiResponse<Paged<CashRegister>>>(url, {
        params,
      })
      .pipe(catchError(this.handleError));
  }

  createCashRegister(
    request: CreateCashRegisterRequest
  ): Observable<ApiResponse<void>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.CASH.CONTROLLER,
      API_CONSTANTS.CASH.CREATE_CASH_REGISTER
    );

    return this.http
      .post<ApiResponse<void>>(url, request)
      .pipe(catchError(this.handleError));
  }

  openCashRegister(
    request: OpenCashRegisterRequest,
    cashRegisterId: number
  ): Observable<ApiResponse<void>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.CASH.CONTROLLER,
      API_CONSTANTS.CASH.OPEN_CASH_REGISTER,
      {
        id: cashRegisterId.toString(),
      }
    );

    return this.http
      .put<ApiResponse<void>>(url, request)
      .pipe(catchError(this.handleError));
  }

  closeCashRegister(
    request: CloseCashRegisterRequest,
    cashRegisterId: number
  ): Observable<ApiResponse<void>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.CASH.CONTROLLER,
      API_CONSTANTS.CASH.CLOSE_CASH_REGISTER,
      {
        id: cashRegisterId.toString(),
      }
    );

    return this.http
      .put<ApiResponse<void>>(url, request)
      .pipe(catchError(this.handleError));
  }

  getStatus(): Observable<ApiResponse<string>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.CASH.CONTROLLER,
      API_CONSTANTS.CASH.STATUS
    );

    return this.http
      .get<ApiResponse<string>>(url)
      .pipe(catchError(this.handleError));
  }

  getCurrentOpenedCashRegister(): Observable<ApiResponse<CashRegister>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.CASH.CONTROLLER,
      API_CONSTANTS.CASH.CURRENT
    );

    return this.http
      .get<ApiResponse<CashRegister>>(url)
      .pipe(catchError(this.handleError));
  }

  getAvailablesCashRegistersToOpen(): Observable<ApiResponse<CashRegister[]>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.CASH.CONTROLLER,
      API_CONSTANTS.CASH.AVAILABLE
    );

    return this.http
      .get<ApiResponse<CashRegister[]>>(url)
      .pipe(catchError(this.handleError));
  }
}
