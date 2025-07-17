import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { get } from 'lodash-es';
import { catchError, Observable } from 'rxjs';
import { Paged } from '../model/paged';
import {
  MarkReadingNotification,
  Notification,
} from '../model/data/notification';
import { API_CONSTANTS, buildUrl } from '../constant';
import { ServiceType } from '../enums/api-enums';
import { notifiactionFilterOptions } from '../model/filter-options';
import { ApiResponse } from '../model/api';

@Injectable({
  providedIn: 'root',
})
export class NotificationService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getUserNotifications(
    page: number,
    size: number,
    filters: notifiactionFilterOptions
  ): Observable<ApiResponse<Paged<Notification>>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.NOTIFICATIONS.CONTROLLER,
      API_CONSTANTS.NOTIFICATIONS.GET_NOTIFICATIONS
    );

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters) {
      params = Object.entries(filters).reduce((acc, [key, value]) => {
        return value !== null && value !== undefined
          ? acc.set(key, String(value))
          : acc;
      }, params);
    }

    return this.http
      .get<ApiResponse<Paged<Notification>>>(url, {
        params,
      })
      .pipe(catchError(this.handleError));
  }

  markNotificationAsRead(
    request: MarkReadingNotification
  ): Observable<ApiResponse<Notification>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.NOTIFICATIONS.CONTROLLER,
      API_CONSTANTS.NOTIFICATIONS.MARK_NOTIFICATIONS_AS_READ
    );

    return this.http
      .put<ApiResponse<Notification>>(url, request)
      .pipe(catchError(this.handleError));
  }
}
