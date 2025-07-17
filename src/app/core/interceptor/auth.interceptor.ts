import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import {
  catchError,
  filter,
  switchMap,
  take,
  finalize,
  tap,
} from 'rxjs/operators';
import { AuthService } from '../service/auth.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const AuthInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);

  const authToken = authService.getAuthToken();
  if (authToken) {
    request = addTokenToRequest(request, authToken);
  }

  request = addLanguageHeader(request);

  return next(request).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handle401Error(request, next, authService);
      }
      return throwError(() => error);
    })
  );
};

function addTokenToRequest(
  request: HttpRequest<unknown>,
  token: string
): HttpRequest<unknown> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}

function handle401Error(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((response) => {
        isRefreshing = false;
        refreshTokenSubject.next(response.accessToken);
        return next(addTokenToRequest(request, response.accessToken));
      }),
      catchError((error) => {
        isRefreshing = false;
        authService.logout();
        return throwError(() => error);
      }),
      finalize(() => {
        isRefreshing = false;
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter((token): token is string => token !== null),
      take(1),
      switchMap((token) => {
        return next(addTokenToRequest(request, token));
      })
    );
  }
}

function addLanguageHeader(
  request: HttpRequest<unknown>
): HttpRequest<unknown> {
  const language = localStorage.getItem('preferredLanguage') || 'es';

  return request.clone({
    setHeaders: {
      'Accept-Language': language,
    },
  });
}
