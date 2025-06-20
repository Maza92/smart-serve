import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_CONSTANTS, buildUrl } from '../constant';
import { ServiceType } from '../enums/api-enums';
import { catchError, Observable } from 'rxjs';
import { Paged } from '../model/paged';
import { InventoryMovement } from '../model/data/inventory-movement';
import { ApiResponse } from '../model/api';

@Injectable({
  providedIn: 'root',
})
export class InventoryMovementService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getMovementsByUserId(
    page: number,
    size: number,
    userId: number
  ): Observable<ApiResponse<Paged<InventoryMovement>>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.INVENTORY_MOVEMENT.CONTROLLER,
      API_CONSTANTS.INVENTORY_MOVEMENT.GET_MOVEMENTS_BY_USER,
      { userId: userId.toString() }
    );

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http
      .get<ApiResponse<Paged<InventoryMovement>>>(url, {
        params,
      })
      .pipe(catchError(this.handleError));
  }

  getMovementsBySupplierId(
    page: number,
    size: number,
    supplierId: number
  ): Observable<ApiResponse<Paged<InventoryMovement>>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.INVENTORY_MOVEMENT.CONTROLLER,
      API_CONSTANTS.INVENTORY_MOVEMENT.GET_MOVEMENTS_BY_SUPPLIER,
      { supplierId: supplierId.toString() }
    );

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http
      .get<ApiResponse<Paged<InventoryMovement>>>(url, {
        params,
      })
      .pipe(catchError(this.handleError));
  }

  getMovementsByOrderId(
    page: number,
    size: number,
    orderId: number
  ): Observable<ApiResponse<Paged<InventoryMovement>>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.INVENTORY_MOVEMENT.CONTROLLER,
      API_CONSTANTS.INVENTORY_MOVEMENT.GET_MOVEMENTS_BY_ORDER,
      { orderId: orderId.toString() }
    );

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http
      .get<ApiResponse<Paged<InventoryMovement>>>(url, {
        params,
      })
      .pipe(catchError(this.handleError));
  }

  getMovementsByItemId(
    page: number,
    size: number,
    itemId: number
  ): Observable<ApiResponse<Paged<InventoryMovement>>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.INVENTORY_MOVEMENT.CONTROLLER,
      API_CONSTANTS.INVENTORY_MOVEMENT.GET_MOVEMENTS_BY_ITEM,
      { itemId: itemId.toString() }
    );

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http
      .get<ApiResponse<Paged<InventoryMovement>>>(url, {
        params,
      })
      .pipe(catchError(this.handleError));
  }

  getLastMovements(
    page: number,
    size: number
  ): Observable<ApiResponse<Paged<InventoryMovement>>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.INVENTORY_MOVEMENT.CONTROLLER,
      API_CONSTANTS.INVENTORY_MOVEMENT.GET_LAST_MOVEMENTS
    );

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http
      .get<ApiResponse<Paged<InventoryMovement>>>(url, {
        params,
      })
      .pipe(catchError(this.handleError));
  }
}
