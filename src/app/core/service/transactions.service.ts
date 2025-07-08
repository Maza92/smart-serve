import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TransactionFilterOptions } from '../model/filter-options';
import { catchError, Observable } from 'rxjs';
import { ApiResponse } from '../model/api';
import { Paged } from '../model/paged';
import { Transaction } from '../model/data/transaction';
import { API_CONSTANTS, buildUrl } from '../constant';
import { ServiceType } from '../enums/api-enums';
import { CreateTransactionRequest } from '../model/transaction/create-transaction-request';
import { CreateOrderTransactionRequest } from '../model/transaction/create-order-transaction-request';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getTransactions(
    page: number,
    size: number,
    filters?: TransactionFilterOptions
  ): Observable<ApiResponse<Paged<Transaction>>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.TRANSACTIONS.CONTROLLER,
      API_CONSTANTS.TRANSACTIONS.GET_TRANSACTIONS
    );
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters) {
      params = Object.entries(filters).reduce((acc, [key, value]) => {
        return value ? acc.set(key, String(value)) : acc;
      }, params);
    }

    return this.http
      .get<ApiResponse<Paged<Transaction>>>(url, {
        params,
      })
      .pipe(catchError(this.handleError));
  }

  getTransactionById(id: number): Observable<ApiResponse<Transaction>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.TRANSACTIONS.CONTROLLER,
      API_CONSTANTS.TRANSACTIONS.GET_TRANSACTION,
      { id: id.toString() }
    );

    return this.http
      .get<ApiResponse<Transaction>>(url)
      .pipe(catchError(this.handleError));
  }

  createTransaction(
    request: CreateTransactionRequest
  ): Observable<ApiResponse<Transaction>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.TRANSACTIONS.CONTROLLER,
      API_CONSTANTS.TRANSACTIONS.CREATE_TRANSACTION
    );

    return this.http
      .post<ApiResponse<Transaction>>(url, request)
      .pipe(catchError(this.handleError));
  }

  createOrderTransaction(
    request: CreateOrderTransactionRequest
  ): Observable<ApiResponse<Transaction>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.TRANSACTIONS.CONTROLLER,
      API_CONSTANTS.TRANSACTIONS.CREATE_ORDER_TRANSACTION
    );

    return this.http
      .post<ApiResponse<Transaction>>(url, request)
      .pipe(catchError(this.handleError));
  }

  deleteTransaction(id: number): Observable<ApiResponse<void>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.TRANSACTIONS.CONTROLLER,
      API_CONSTANTS.TRANSACTIONS.DELETE_TRANSACTION,
      { id: id.toString() }
    );

    return this.http
      .delete<ApiResponse<void>>(url)
      .pipe(catchError(this.handleError));
  }
}
