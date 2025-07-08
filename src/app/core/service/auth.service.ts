import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { API_CONSTANTS, buildUrl } from '@core/constant/api.constant';
import { LocalStorageService } from '@core/service/local-storage.service';
import { LoginResponse } from '@core/model/auth/login-response';
import { LoginRequest } from '@core/model/auth/login-request';
import { RefreshTokenResponse } from '@core/model/auth/refresh-toke-response';
import { RefreshTokenRequest } from '@core/model/auth/refresh-token-request';
import { BaseService } from '@core/service/base.service';
import { RegisterRequest } from '@core/model/auth/register-request';
import { ForgotPasswordRequest } from '@core/model/auth/forgot-password-request';
import { ResetCodeRequest } from '@core/model/auth/reset-code-request';
import { ResetTokenResponse } from '@core/model/auth/reset-token-response';
import { RecoverPasswordRequest } from '@core/model/auth/recover-password-request';
import { ResetPasswordRequest } from '@core/model/auth/reset-password-request';
import { ResetPasswordByAdminRequest } from '@core/model/auth/reset-password-by-admin-request';
import { ServiceType } from '../enums/api-enums';
import { ActiveSession } from '../model/auth/active-session';
import { User } from '../model/data/user';
import { ApiResponse } from '../model/api';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {
  private readonly AUTH_TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly TOKEN_EXPIRATION_KEY = 'token_expiration';
  private readonly USER_NAME_KEY = 'user_name';
  private readonly USER_PROFILE_KEY = 'user_profile';
  private readonly USER_ID_KEY = 'user_id';

  private authToken$ = new BehaviorSubject<string | null>(null);
  private currentUser$ = new BehaviorSubject<User | null>(null);

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    super();
    this.loadSessionFromStorage();
  }

  private loadSessionFromStorage(): void {
    const token = this.getAuthTokenFromStorage();
    this.authToken$.next(token);

    const userProfile = this.localStorageService.get<User>(
      this.USER_PROFILE_KEY
    );
    this.currentUser$.next(userProfile);

    if (token && !userProfile) {
      this.fetchAndStoreUserProfile().subscribe();
    }
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    const url = buildUrl(
      ServiceType.AUTH,
      API_CONSTANTS.AUTH.CONTROLLER,
      API_CONSTANTS.AUTH.LOGIN
    );

    return this.http.post<LoginResponse>(url, request).pipe(
      switchMap((response: LoginResponse) => {
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
        this.localStorageService.set(this.USER_ID_KEY, response.userId);
        this.authToken$.next(response.token);
        return this.fetchAndStoreUserProfile().pipe(map(() => response));
      }),
      catchError((error) => {
        this.clearAuthData();
        return this.handleError(error);
      })
    );
  }

  fetchAndStoreUserProfile(): Observable<ApiResponse<User>> {
    const url = buildUrl(
      ServiceType.API,
      API_CONSTANTS.USER.CONTROLLER,
      API_CONSTANTS.USER.GET_ME
    );

    return this.http.get<ApiResponse<User>>(url).pipe(
      tap((response) => {
        this.localStorageService.set(this.USER_PROFILE_KEY, response.data);
        this.currentUser$.next(response.data);
      })
    );
  }

  logout(): Observable<void> {
    const url = buildUrl(
      ServiceType.AUTH,
      API_CONSTANTS.AUTH.CONTROLLER,
      API_CONSTANTS.AUTH.LOGOUT
    );

    return this.http.post<void>(url, {}).pipe(
      tap(() => {
        this.clearAuthData();
      }),
      catchError((error) => {
        this.clearAuthData();
        return this.handleError(error);
      })
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
      tap((response) => {
        this.localStorageService.set(this.AUTH_TOKEN_KEY, response.accessToken);
        this.localStorageService.set(
          this.REFRESH_TOKEN_KEY,
          response.refreshToken
        );
        this.localStorageService.set(
          this.TOKEN_EXPIRATION_KEY,
          response.expiration
        );
        this.authToken$.next(response.accessToken);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  register(request: RegisterRequest): Observable<void> {
    const url = buildUrl(
      ServiceType.AUTH,
      API_CONSTANTS.AUTH.CONTROLLER,
      API_CONSTANTS.AUTH.REGISTER
    );

    return this.http
      .post<void>(url, request)
      .pipe(catchError(this.handleError));
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<void> {
    const url = buildUrl(
      ServiceType.AUTH,
      API_CONSTANTS.AUTH.CONTROLLER,
      API_CONSTANTS.AUTH.FORGOT_PASSWORD
    );

    return this.http
      .post<void>(url, request)
      .pipe(catchError(this.handleError));
  }

  verifyResetCode(request: ResetCodeRequest): Observable<ResetTokenResponse> {
    const url = buildUrl(
      ServiceType.AUTH,
      API_CONSTANTS.AUTH.CONTROLLER,
      API_CONSTANTS.AUTH.VERIFY_RESET_CODE
    );

    return this.http
      .post<ResetTokenResponse>(url, request)
      .pipe(catchError(this.handleError));
  }

  recoverPassword(request: RecoverPasswordRequest): Observable<void> {
    const url = buildUrl(
      ServiceType.AUTH,
      API_CONSTANTS.AUTH.CONTROLLER,
      API_CONSTANTS.AUTH.RECOVER_PASSWORD
    );

    return this.http
      .post<void>(url, request)
      .pipe(catchError(this.handleError));
  }

  resetPassword(request: ResetPasswordRequest): Observable<void> {
    const url = buildUrl(
      ServiceType.AUTH,
      API_CONSTANTS.AUTH.CONTROLLER,
      API_CONSTANTS.AUTH.RESET_PASSWORD
    );

    return this.http
      .post<void>(url, request)
      .pipe(catchError(this.handleError));
  }

  resetPasswordByAdmin(
    request: ResetPasswordByAdminRequest,
    userId: number
  ): Observable<void> {
    const url = buildUrl(
      ServiceType.AUTH,
      API_CONSTANTS.AUTH.CONTROLLER,
      API_CONSTANTS.AUTH.RESET_PASSWORD_BY_ADMIN,
      {
        id: userId.toString(),
      }
    );

    return this.http
      .post<void>(url, request)
      .pipe(catchError(this.handleError));
  }

  getActiveSessions(): Observable<ActiveSession> {
    const url = buildUrl(
      ServiceType.AUTH,
      API_CONSTANTS.AUTH.CONTROLLER,
      API_CONSTANTS.AUTH.GET_ACTIVE_SESSIONS
    );

    return this.http.get<ActiveSession>(url).pipe(catchError(this.handleError));
  }

  revokeAllSessions(): Observable<void> {
    const url = buildUrl(
      ServiceType.AUTH,
      API_CONSTANTS.AUTH.CONTROLLER,
      API_CONSTANTS.AUTH.REVOKE_ALL_SESSIONS
    );

    return this.http.post<void>(url, {}).pipe(catchError(this.handleError));
  }

  revokeSession(id: number): Observable<void> {
    const url = buildUrl(
      ServiceType.AUTH,
      API_CONSTANTS.AUTH.CONTROLLER,
      API_CONSTANTS.AUTH.REVOKE_SESSION,
      { id: id.toString() }
    );

    return this.http.post<void>(url, {}).pipe(catchError(this.handleError));
  }

  clearAuthData(): void {
    this.localStorageService.remove(this.AUTH_TOKEN_KEY);
    this.localStorageService.remove(this.REFRESH_TOKEN_KEY);
    this.localStorageService.remove(this.TOKEN_EXPIRATION_KEY);
    this.localStorageService.remove(this.USER_PROFILE_KEY);
    this.authToken$.next(null);
    this.currentUser$.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.authToken$.getValue();
  }

  public getCurrentUser(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }

  public getCurrentUserSnapshot(): User | null {
    return this.currentUser$.getValue();
  }

  public userHasRole(role: string): Observable<boolean> {
    return this.currentUser$.pipe(map((user) => user?.roleName === role));
  }

  public userHasAnyRole(roles: string[]): Observable<boolean> {
    return this.currentUser$.pipe(
      map((user) => roles.includes(user?.roleName ?? ''))
    );
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

  public getAuthTokenObservable(): Observable<string | null> {
    return this.authToken$.asObservable();
  }

  public getAuthTokenSnapshot(): string | null {
    return this.authToken$.getValue();
  }

  private getAuthTokenFromStorage(): string | null {
    return this.localStorageService.get<string>(this.AUTH_TOKEN_KEY);
  }
}
