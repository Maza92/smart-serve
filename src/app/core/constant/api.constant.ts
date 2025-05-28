import { environment } from '@environments/environment';
import { ServiceType } from '../enums/api-enums';

export const API_CONSTANTS = {
  AUTH: {
    CONTROLLER: '/auth',
    VERIFY_RESET_CODE: '/verify-reset-code',
    RESET_PASSWORD: '/reset-password',
    RESET_PASSWORD_BY_ADMIN: '/reset-password-by-admin/:id',
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

  PING: {
    CONTROLLER: '/ping',
    PING: '',
  },

  CASH: {
    CONTROLLER: '/cash',
    STATUS: '/status',
    CURRENT: '/current',
    AVAILABLE: '/available',
    GET_CASH_REGISTERS: '',
    CREATE_CASH_REGISTER: '/create',
    OPEN_CASH_REGISTER: '/open/:id',
    CLOSE_CASH_REGISTER: '/close/:id',
  },

  TABLE: {
    CONTROLLER: '/restaurant-tables',
    GET_TABLE: '/:id',
    GET_TABLES: '',
    CREATE_TABLE: '',
    UPDATE_TABLE: '/:id',
  },

  INVENTORY: {
    CONTROLLER: '/inventory',
    UPDATE_STOCK: '/update-stock',
  },

  INVENTORY_ITEM: {
    CONTROLLER: '/inventory-items',
    GET_ITEM: '/:id',
    GET_ITEMS: '',
    CREATE_ITEM: '',
    UPDATE_ITEM: '/:id',
    DELETE_ITEM: '/:id',
  },

  SUPPLIER: {
    CONTROLLER: '/suppliers',
    GET_SUPPLIER: '/:id',
    GET_SUPPLIERS: '',
    CREATE_SUPPLIER: '',
    UPDATE_SUPPLIER: '/:id',
    DELETE_SUPPLIER: '/:id',
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
