import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_CONSTANTS, buildUrl } from '../constant';
import { catchError, Observable } from 'rxjs';
import { ApiResponse } from '../model/api';
import { BaseService } from './base.service';
import { ServiceType } from '../enums/api-enums';
import { Paged } from '../model/paged';
import { CreateSupplierRequest } from '../model/supplier/create-supplier-request';
import { UpdateSupplierRequest } from '../model/supplier/update-supplier-request';
import { Supplier } from '../model/data/supplier';
import { BaseRequiredSortFilterOptions } from '../model/filter-options';

@Injectable({
  providedIn: 'root',
})
export class SupplierService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getSuppliers(
    page: number,
    size: number,
    filters?: BaseRequiredSortFilterOptions
  ): Observable<ApiResponse<Paged<Supplier>>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.SUPPLIER.CONTROLLER,
      API_CONSTANTS.SUPPLIER.GET_SUPPLIERS
    );

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters) {
      if (filters.search) {
        params = params.set('search', filters.search);
      }
      if (filters.status) {
        params = params.set('isActive', filters.status);
      }
      if (filters.sortBy) {
        params = params.set('sortBy', filters.sortBy);
      }
      if (filters.sortDirection) {
        params = params.set(
          'sortDirection',
          filters.sortDirection.toUpperCase()
        );
      }
    }

    return this.http
      .get<ApiResponse<Paged<Supplier>>>(url, {
        params,
      })
      .pipe(catchError(this.handleError));
  }

  getSupplierById(id: number): Observable<ApiResponse<Supplier>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.SUPPLIER.CONTROLLER,
      API_CONSTANTS.SUPPLIER.GET_SUPPLIER,
      { id: id.toString() }
    );

    return this.http
      .get<ApiResponse<Supplier>>(url)
      .pipe(catchError(this.handleError));
  }

  createSupplier(
    supplier: CreateSupplierRequest
  ): Observable<ApiResponse<Supplier>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.SUPPLIER.CONTROLLER,
      API_CONSTANTS.SUPPLIER.CREATE_SUPPLIER
    );

    return this.http
      .post<ApiResponse<Supplier>>(url, supplier)
      .pipe(catchError(this.handleError));
  }

  updateSupplier(
    id: number,
    supplier: UpdateSupplierRequest
  ): Observable<ApiResponse<Supplier>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.SUPPLIER.CONTROLLER,
      API_CONSTANTS.SUPPLIER.UPDATE_SUPPLIER,
      { id: id.toString() }
    );

    return this.http
      .put<ApiResponse<Supplier>>(url, supplier)
      .pipe(catchError(this.handleError));
  }

  deleteSupplier(id: number): Observable<ApiResponse<void>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.SUPPLIER.CONTROLLER,
      API_CONSTANTS.SUPPLIER.DELETE_SUPPLIER,
      { id: id.toString() }
    );

    return this.http
      .delete<ApiResponse<void>>(url)
      .pipe(catchError(this.handleError));
  }
}
