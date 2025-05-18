import { environment } from '@environments/environment';

export enum ServiceType {
  AUTH = 'auth',
  API = 'api',
}

export const API_CONSTANTS = {
  AUTH: {
    CONTROLLER: '/auth',
    VERIFY_RESET_TOKEN: '/verify-reset-token',
    RESET_PASSWORD: '/reset-password',
    REGISTER: '/register',
    REFRESH_TOKEN: '/refresh-token',
    RECOVER_PASSWORD: '/recover-password',
    LOGOUT: '/logout',
    LOGIN: '/login',
    FORGOT_PASSWORD: '/forgot-password',
  },

  USER: {
    CONTROLLER: '/users',
    GET_USER: '/:id',
    GET_USERS: '',
    CREATE_USER: '',
    UPDATE_USER: '/:id',
    DELETE_USER: '/:id',
  },
};

export function getBaseUrl(serviceType: ServiceType): string {
  switch (serviceType) {
    case ServiceType.AUTH:
      return environment.authApiUrl;
    case ServiceType.API:
      return environment.apiUrl;
    default:
      throw new Error(`Service not support: ${serviceType}`);
  }
}

export function buildUrl(
  serviceType: ServiceType,
  controller: string,
  endpoint: string,
  params?: Record<string, string>
): string {
  const baseUrl = getBaseUrl(serviceType);
  let url = `${baseUrl}${controller}${endpoint}`;

  if (params) {
    Object.keys(params).forEach((key) => {
      url = url.replace(`:${key}`, params[key]);
    });
  }

  return url;
}
