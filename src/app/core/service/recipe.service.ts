import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { catchError, Observable } from 'rxjs';
import { ApiResponse } from '../model/api';
import { Paged } from '../model/paged';
import { Recipe } from '../model/data/recipe';
import { API_CONSTANTS, buildUrl } from '../constant';
import { ServiceType } from '../enums/api-enums';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CreateRecipeRequest } from '../model/recipe/create-recipe';
import { UpdateDishRequest } from '../model/dish/update-dish-request';
import { UpdateRecipeRequest } from '../model/recipe/update-recipe';

@Injectable({
  providedIn: 'root',
})
export class RecipeService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getRecipes(
    page: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string
  ): Observable<ApiResponse<Paged<Recipe>>> {
    const url = buildUrl(
        ServiceType.API,
        API_CONSTANTS.RECIPE.CONTROLLER,
        API_CONSTANTS.RECIPE.GET_RECIPES
      ),
      params = new HttpParams()
        .set('page', page)
        .set('pageSize', pageSize)
        .set('sortBy', sortBy)
        .set('sortDirection', sortDirection);

    return this.http
      .get<ApiResponse<Paged<Recipe>>>(url, { params })
      .pipe(catchError(this.handleError));
  }

  getRecipe(id: number): Observable<ApiResponse<Recipe>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.RECIPE.CONTROLLER,
      API_CONSTANTS.RECIPE.GET_RECIPE,
      { id: id.toString() }
    );

    return this.http
      .get<ApiResponse<Recipe>>(url)
      .pipe(catchError(this.handleError));
  }

  createRecipe(request: CreateRecipeRequest): Observable<ApiResponse<Recipe>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.RECIPE.CONTROLLER,
      API_CONSTANTS.RECIPE.CREATE_RECIPE
    );

    return this.http
      .post<ApiResponse<Recipe>>(url, request)
      .pipe(catchError(this.handleError));
  }

  updateRecipe(
    id: number,
    request: UpdateRecipeRequest
  ): Observable<ApiResponse<Recipe>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.RECIPE.CONTROLLER,
      API_CONSTANTS.RECIPE.UPDATE_RECIPE,
      { id: id.toString() }
    );

    return this.http
      .put<ApiResponse<Recipe>>(url, request)
      .pipe(catchError(this.handleError));
  }

  deleteRecipe(id: number): Observable<ApiResponse<Recipe>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.RECIPE.CONTROLLER,
      API_CONSTANTS.RECIPE.DELETE_RECIPE,
      { id: id.toString() }
    );

    return this.http
      .delete<ApiResponse<Recipe>>(url)
      .pipe(catchError(this.handleError));
  }
}
