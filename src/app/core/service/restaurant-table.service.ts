import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_CONSTANTS, buildUrl } from '../constant';
import { catchError, Observable } from 'rxjs';
import { ApiResponse } from '../model/api';
import { RestaurantTable } from '../model/data/restaurant-table';
import { Paged } from '../model/paged';
import { CreateRestaurantTableRequest } from '../model/restaurant-table/create-restaurant-table-request';
import { UpdateRestaurantTableRequest } from '../model/restaurant-table/update-restaurant-table-request';
import { ServiceType } from '../enums/api-enums';

@Injectable({
  providedIn: 'root',
})
export class RestaurantTableService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getTables(
    page: number,
    size: number,
    number?: number,
    status?: string,
    section?: string,
    sortBy: string = 'id',
    sortDirection: string = 'asc'
  ): Observable<ApiResponse<Paged<RestaurantTable>>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.TABLE.CONTROLLER,
      API_CONSTANTS.TABLE.GET_TABLES
    );

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection);

    if (number) {
      params = params.set('number', number.toString());
    }
    if (status) {
      params = params.set('status', status);
    }
    if (section) {
      params = params.set('section', section);
    }

    return this.http
      .get<ApiResponse<Paged<RestaurantTable>>>(url, {
        params,
      })
      .pipe(catchError(this.handleError));
  }

  getTableById(id: number): Observable<ApiResponse<RestaurantTable>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.TABLE.CONTROLLER,
      API_CONSTANTS.TABLE.GET_TABLE,
      { id: id.toString() }
    );

    return this.http
      .get<ApiResponse<RestaurantTable>>(url)
      .pipe(catchError(this.handleError));
  }

  createTable(
    table: CreateRestaurantTableRequest
  ): Observable<ApiResponse<void>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.TABLE.CONTROLLER,
      API_CONSTANTS.TABLE.CREATE_TABLE
    );

    return this.http
      .post<ApiResponse<void>>(url, table)
      .pipe(catchError(this.handleError));
  }

  updateTable(
    table: UpdateRestaurantTableRequest,
    id: number
  ): Observable<ApiResponse<void>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.TABLE.CONTROLLER,
      API_CONSTANTS.TABLE.UPDATE_TABLE,
      { id: id.toString() }
    );

    return this.http
      .put<ApiResponse<void>>(url, table)
      .pipe(catchError(this.handleError));
  }
}
