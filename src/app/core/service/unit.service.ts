import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONSTANTS, buildUrl } from '@app/core/constant/api.constant';
import { ServiceType } from '../enums/api-enums';
import { catchError, Observable } from 'rxjs';
import { ApiResponse } from '../model/api';
import { Unit } from '../model/data/unit';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class UnitService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getUnits(): Observable<ApiResponse<Unit[]>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.UNIT.CONTROLLER,
      API_CONSTANTS.UNIT.GET_UNITS
    );

    return this.http
      .get<ApiResponse<Unit[]>>(url)
      .pipe(catchError(this.handleError));
  }
}
