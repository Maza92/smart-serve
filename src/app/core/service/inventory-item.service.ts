import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_CONSTANTS, buildUrl } from '../constant';
import { catchError, Observable } from 'rxjs';
import { ApiResponse } from '../model/api';
import { BaseService } from './base.service';
import {
  FilterOptions,
  InventoryItemsFilterOptions,
} from '../model/filter-options';
import { ServiceType } from '../enums/api-enums';
import { Paged } from '../model/paged';
import { CreateInventoryItemRequest } from '../model/inventory-item/create-inventory-item';
import { UpdateInventoryItemRequest } from '../model/inventory-item/update-inventory-item';
import { InventoryItem } from '../model/data/inventory-item';

@Injectable({
  providedIn: 'root',
})
export class InventoryItemService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getInventoryItems(
    page: number,
    size: number,
    filters?: InventoryItemsFilterOptions
  ): Observable<ApiResponse<Paged<InventoryItem>>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.INVENTORY_ITEM.CONTROLLER,
      API_CONSTANTS.INVENTORY_ITEM.GET_ITEMS
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
      if (filters.location) {
        params = params.set('location', filters.location);
      }
      if (filters.sortBy) {
        params = params.set('sortBy', filters.sortBy);
      }
      if (filters.sortDirection) {
        params = params.set('sortDirection', filters.sortDirection);
      }
    }

    return this.http
      .get<ApiResponse<Paged<InventoryItem>>>(url, {
        params,
      })
      .pipe(catchError(this.handleError));
  }

  getInventoryItemsBySupplierId(
    supplierId: number,
    page: number,
    size: number
  ): Observable<ApiResponse<Paged<InventoryItem>>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.INVENTORY_ITEM.CONTROLLER,
      API_CONSTANTS.INVENTORY_ITEM.GET_ITEMS_BY_SUPPLIER,
      { supplierId: supplierId.toString() }
    );

    let params = new HttpParams()
      .set('size', size.toString())
      .set('page', page.toString());

    return this.http
      .get<ApiResponse<Paged<InventoryItem>>>(url, {
        params,
      })
      .pipe(catchError(this.handleError));
  }

  getInventoryItemById(id: number): Observable<ApiResponse<InventoryItem>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.INVENTORY_ITEM.CONTROLLER,
      API_CONSTANTS.INVENTORY_ITEM.GET_ITEM,
      { id: id.toString() }
    );

    return this.http
      .get<ApiResponse<InventoryItem>>(url)
      .pipe(catchError(this.handleError));
  }

  createInventoryItem(
    item: CreateInventoryItemRequest
  ): Observable<ApiResponse<InventoryItem>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.INVENTORY_ITEM.CONTROLLER,
      API_CONSTANTS.INVENTORY_ITEM.CREATE_ITEM
    );

    return this.http
      .post<ApiResponse<InventoryItem>>(url, item)
      .pipe(catchError(this.handleError));
  }

  updateInventoryItem(
    id: number,
    item: UpdateInventoryItemRequest
  ): Observable<ApiResponse<InventoryItem>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.INVENTORY_ITEM.CONTROLLER,
      API_CONSTANTS.INVENTORY_ITEM.UPDATE_ITEM,
      { id: id.toString() }
    );

    return this.http
      .put<ApiResponse<InventoryItem>>(url, item)
      .pipe(catchError(this.handleError));
  }

  deleteInventoryItem(id: number): Observable<ApiResponse<void>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.INVENTORY_ITEM.CONTROLLER,
      API_CONSTANTS.INVENTORY_ITEM.DELETE_ITEM,
      { id: id.toString() }
    );

    return this.http
      .delete<ApiResponse<void>>(url)
      .pipe(catchError(this.handleError));
  }
}
