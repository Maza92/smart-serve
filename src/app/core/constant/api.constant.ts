import { environment } from '@environments/environment';

export enum ServiceType {
  AUTH = 'auth',
  API = 'api',
}

export const API_CONSTANTS = {
  AUTH: {
    CONTROLLER: '/auth',
    LOGIN: '/login',
    REGISTER: '/register',
    LOGOUT: '/logout',
    REFRESH_TOKEN: '/refresh-token',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
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
