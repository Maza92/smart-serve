import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../model/api';
import { Paged } from '../model/paged';
import { CategoryItem } from '../model/data/category-item';
import { API_CONSTANTS, buildUrl } from '../constant';
import { ServiceType } from '../enums/api-enums';
import { CategoryType } from '../enums/category-enums';

@Injectable({
  providedIn: 'root',
})
export class CategoryItemService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getCategoryItems(
    page: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string
  ): Observable<ApiResponse<Paged<CategoryItem>>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.CATEGORY_ITEM.CONTROLLER,
      API_CONSTANTS.CATEGORY_ITEM.GET_CATEGORY_ITEMS
    );

    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection);

    return this.http.get<ApiResponse<Paged<CategoryItem>>>(url, { params });
  }

  getCategoryItemsByTipe(
    page: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string,
    categoryType: CategoryType
  ): Observable<ApiResponse<Paged<CategoryItem>>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.CATEGORY_ITEM.CONTROLLER,
      API_CONSTANTS.CATEGORY_ITEM.GET_CATEGORY_ITEMS_BY_TYPE
    );

    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection)
      .set('categoryType', categoryType);

    return this.http.get<ApiResponse<Paged<CategoryItem>>>(url, { params });
  }
}
