import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { ApiError } from '../model/api';

export abstract class BaseService {
  protected handleError(error: HttpErrorResponse) {
    let apiError: ApiError;

    if (error.status === 0) {
      apiError = {
        status: 0,
        message: 'Connection refused',
        timestamp: new Date().toISOString(),
        errors: [],
      };
    } else {
      apiError = error.error as ApiError;
    }

    return throwError(() => apiError);
  }
}
