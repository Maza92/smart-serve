import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { API_CONSTANTS, ServiceType, buildUrl } from '../constant/api.constant';
import { LocalStorageService } from './local-storage.service';
import { ApiError } from '@core/model/api';
import { LoginResponse } from '@core/model/auth/login-response';
import { LoginRequest } from '@core/model/auth/login-request';
import { RefreshTokenResponse } from '@core/model/auth/refresh-toke-response';
import { RefreshTokenRequest } from '@core/model/auth/refresh-token-request';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {
  private readonly AUTH_TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly TOKEN_EXPIRATION_KEY = 'token_expiration';
  private readonly USER_NAME_KEY = 'user_name';

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    super();
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    const url = buildUrl(
      ServiceType.AUTH,
      API_CONSTANTS.AUTH.CONTROLLER,
      API_CONSTANTS.AUTH.LOGIN
    );

    return this.http.post<LoginResponse>(url, request).pipe(
      map((response) => {
        this.localStorageService.set(this.AUTH_TOKEN_KEY, response.token);
        this.localStorageService.set(
          this.REFRESH_TOKEN_KEY,
          response.refreshToken
        );
        this.localStorageService.set(
          this.TOKEN_EXPIRATION_KEY,
          response.expiration
        );
        this.localStorageService.set(this.USER_NAME_KEY, response.username);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  logout(): Observable<void> {
    const url = buildUrl(
      ServiceType.AUTH,
      API_CONSTANTS.AUTH.CONTROLLER,
      API_CONSTANTS.AUTH.LOGOUT
    );

    return this.http.post<void>(url, {}).pipe(
      map(() => {
        this.clearAuthData();
      }),
      catchError(this.handleError)
    );
  }

  refreshToken(): Observable<RefreshTokenResponse> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    const url = buildUrl(
      ServiceType.AUTH,
      API_CONSTANTS.AUTH.CONTROLLER,
      API_CONSTANTS.AUTH.REFRESH_TOKEN
    );

    const request: RefreshTokenRequest = { refreshToken };

    return this.http.post<RefreshTokenResponse>(url, request).pipe(
      map((response) => {
        this.localStorageService.set(this.AUTH_TOKEN_KEY, response.accessToken);
        this.localStorageService.set(
          this.REFRESH_TOKEN_KEY,
          response.refreshToken
        );
        this.localStorageService.set(
          this.TOKEN_EXPIRATION_KEY,
          response.expiration
        );
        return response;
      }),
      catchError(this.handleError)
    );
  }

  clearAuthData(): void {
    this.localStorageService.remove(this.AUTH_TOKEN_KEY);
    this.localStorageService.remove(this.REFRESH_TOKEN_KEY);
    this.localStorageService.remove(this.TOKEN_EXPIRATION_KEY);
  }

  isAuthenticated(): boolean {
    return this.localStorageService.exists(this.AUTH_TOKEN_KEY);
  }

  getAuthToken(): string | null {
    return this.localStorageService.get<string>(this.AUTH_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return this.localStorageService.get<string>(this.REFRESH_TOKEN_KEY);
  }

  getTokenExpiration(): Date | null {
    const expirationTimestamp = this.localStorageService.get<number>(
      this.TOKEN_EXPIRATION_KEY
    );

    if (expirationTimestamp) {
      return new Date(expirationTimestamp);
    }

    return null;
  }

  getUserName(): string | null {
    return this.localStorageService.get<string>(this.USER_NAME_KEY);
  }
}
