import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_CONSTANTS, buildUrl, ServiceType } from '../constant';
import { catchError, Observable } from 'rxjs';
import { ApiResponse } from '../model/api';
import { Paged } from '../model/paged';
import { User } from '../model/data/user';
import { BaseService } from './base.service';
import { FilterOptions } from '../model/filter-options';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getUsers(
    page: number,
    size: number,
    filters?: FilterOptions
  ): Observable<ApiResponse<Paged<User>>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.USER.CONTROLLER,
      API_CONSTANTS.USER.GET_USERS
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
      .get<ApiResponse<Paged<User>>>(url, {
        params,
      })
      .pipe(catchError(this.handleError));
  }

  getUserById(id: number): Observable<ApiResponse<User>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.USER.CONTROLLER,
      API_CONSTANTS.USER.GET_USER,
      { id: id.toString() }
    );

    return this.http
      .get<ApiResponse<User>>(url)
      .pipe(catchError(this.handleError));
  }

  updateUser(id: number, user: User): Observable<ApiResponse<User>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.USER.CONTROLLER,
      API_CONSTANTS.USER.UPDATE_USER,
      { id: id.toString() }
    );

    return this.http
      .put<ApiResponse<User>>(url, user)
      .pipe(catchError(this.handleError));
  }
}
