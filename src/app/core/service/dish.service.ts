import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DishFilterOptions } from '../model/filter-options';
import { catchError, Observable } from 'rxjs';
import { ApiResponse } from '../model/api';
import { Paged } from '../model/paged';
import {
  Dish,
  DishWithIngredients,
  DishWithIngredientsToUpdate,
} from '../model/data/dish';
import { API_CONSTANTS, buildUrl } from '../constant';
import { ServiceType } from '../enums/api-enums';
import { CreateDishRequest } from '../model/dish/create-dish-request';
import { UpdateDishRequest } from '../model/dish/update-dish-request';
import { Ingredient, IngredientSummary } from '../model/data/recipe';

@Injectable({
  providedIn: 'root',
})
export class DishService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getDishes(
    page: number,
    pageSize: number,
    filters?: DishFilterOptions
  ): Observable<ApiResponse<Paged<Dish>>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.DISH.CONTROLLER,
      API_CONSTANTS.DISH.GET_DISHES
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
      .get<ApiResponse<Paged<Dish>>>(url, { params })
      .pipe(catchError(this.handleError));
  }

  getDishesWithIngredients(
    page: number,
    pageSize: number,
    filters?: DishFilterOptions
  ): Observable<ApiResponse<Paged<DishWithIngredients>>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.DISH.CONTROLLER,
      API_CONSTANTS.DISH.GET_DISHES_WITH_INGREDIENTS
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
      .get<ApiResponse<Paged<DishWithIngredients>>>(url, { params })
      .pipe(catchError(this.handleError));
  }

  getDishIngredients(id: number): Observable<ApiResponse<Ingredient[]>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.DISH.CONTROLLER,
      API_CONSTANTS.DISH.GET_DISH_INGREDIENTS,
      { id: id.toString() }
    );

    return this.http
      .get<ApiResponse<Ingredient[]>>(url)
      .pipe(catchError(this.handleError));
  }

  getDishById(id: number): Observable<ApiResponse<Dish>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.DISH.CONTROLLER,
      API_CONSTANTS.DISH.GET_DISH,
      { id: id.toString() }
    );

    return this.http
      .get<ApiResponse<Dish>>(url)
      .pipe(catchError(this.handleError));
  }

  getDishWithIngredientsById(
    id: number
  ): Observable<ApiResponse<DishWithIngredientsToUpdate>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.DISH.CONTROLLER,
      API_CONSTANTS.DISH.GET_DISH_WITH_INGREDIENTS,
      { id: id.toString() }
    );

    return this.http
      .get<ApiResponse<DishWithIngredientsToUpdate>>(url)
      .pipe(catchError(this.handleError));
  }

  createDish(request: CreateDishRequest): Observable<ApiResponse<void>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.DISH.CONTROLLER,
      API_CONSTANTS.DISH.CREATE_DISH
    );

    return this.http
      .post<ApiResponse<void>>(url, request)
      .pipe(catchError(this.handleError));
  }

  updateDish(
    id: number,
    request: UpdateDishRequest
  ): Observable<ApiResponse<void>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.DISH.CONTROLLER,
      API_CONSTANTS.DISH.UPDATE_DISH,
      { id: id.toString() }
    );

    return this.http
      .put<ApiResponse<void>>(url, request)
      .pipe(catchError(this.handleError));
  }

  deleteDish(id: number): Observable<ApiResponse<void>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.DISH.CONTROLLER,
      API_CONSTANTS.DISH.DELETE_DISH,
      { id: id.toString() }
    );

    return this.http
      .delete<ApiResponse<void>>(url)
      .pipe(catchError(this.handleError));
  }
}
