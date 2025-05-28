import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_CONSTANTS, buildUrl } from '../constant';
import { catchError, Observable } from 'rxjs';
import { ApiResponse } from '../model/api';
import { BaseService } from './base.service';
import { ServiceType } from '../enums/api-enums';
import { UpdateInventoryItemStockDto } from '../model/inventory/update-inventory-item-stock';

@Injectable({
  providedIn: 'root',
})
export class InventoryService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  updateStock(
    request: UpdateInventoryItemStockDto
  ): Observable<ApiResponse<void>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.INVENTORY.CONTROLLER,
      API_CONSTANTS.INVENTORY.UPDATE_STOCK
    );

    return this.http
      .post<ApiResponse<void>>(url, request)
      .pipe(catchError(this.handleError));
  }
}
