import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { API_CONSTANTS, buildUrl } from '../constant';
import { catchError, Observable } from 'rxjs';
import { ServiceType } from '../enums/api-enums';

@Injectable({
  providedIn: 'root',
})
export class PingService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  ping(): Observable<void> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.PING.CONTROLLER,
      API_CONSTANTS.PING.PING
    );

    return this.http.get<void>(url).pipe(catchError(this.handleError));
  }
}
