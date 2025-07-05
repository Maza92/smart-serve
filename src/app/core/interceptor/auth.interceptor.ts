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

  // Log de la petición saliente
  console.log('🚀 HTTP Request:', {
    method: request.method,
    url: request.url,
    headers: request.headers.keys().reduce((acc, key) => {
      acc[key] = request.headers.get(key);
      return acc;
    }, {} as any),
    body: request.body ? JSON.stringify(request.body) : null,
  });

  const authToken = authService.getAuthToken();
  if (authToken) {
    request = addTokenToRequest(request, authToken);
    console.log('🔑 Token agregado a la petición:', request.url);
  }

  request = addLanguageHeader(request);

  return next(request).pipe(
    tap((event) => {
      // Log de respuestas exitosas
      if (event instanceof HttpResponse) {
        console.log('✅ HTTP Response:', {
          status: event.status,
          statusText: event.statusText,
          url: event.url,
          headers: event.headers.keys().reduce((acc, key) => {
            acc[key] = event.headers.get(key);
            return acc;
          }, {} as any),
          body: event.body ? JSON.stringify(event.body) : null,
        });
      }
    }),
    catchError((error) => {
      // Log de errores HTTP
      console.error('❌ HTTP Error:', {
        status: error.status,
        statusText: error.statusText,
        url: error.url,
        message: error.message,
        error: JSON.stringify(error.error),
        headers: error.headers
          ? error.headers.keys().reduce((acc: any, key: string) => {
              acc[key] = error.headers.get(key);
              return acc;
            }, {} as any)
          : null,
      });

      if (error instanceof HttpErrorResponse && error.status === 401) {
        console.log('🔄 Handling 401 error - attempting token refresh');
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
    console.log('🔄 Starting token refresh process');

    return authService.refreshToken().pipe(
      switchMap((response) => {
        isRefreshing = false;
        refreshTokenSubject.next(response.accessToken);
        console.log(
          '✅ Token refreshed successfully, retrying original request:',
          request.url
        );
        return next(addTokenToRequest(request, response.accessToken));
      }),
      catchError((error) => {
        isRefreshing = false;
        console.error('❌ Token refresh failed:', JSON.stringify(error));
        console.log('🚪 Logging out user due to refresh failure');
        authService.logout();
        return throwError(() => error);
      }),
      finalize(() => {
        isRefreshing = false;
        console.log('🏁 Token refresh process completed');
      })
    );
  } else {
    console.log('⏳ Token refresh already in progress, waiting...');
    return refreshTokenSubject.pipe(
      filter((token): token is string => token !== null),
      take(1),
      switchMap((token) => {
        console.log(
          '🔄 Using refreshed token for queued request:',
          request.url
        );
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
