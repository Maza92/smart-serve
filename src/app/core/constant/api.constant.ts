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
    UPDATE_STOCK_BATCH: '/update-stock-batch',
    UPDATE_STOCK_BATCH_ASYNC: '/update-stock-batch-async',
  },

  INVENTORY_ITEM: {
    CONTROLLER: '/inventory-items',
    GET_ITEM: '/:id',
    GET_ITEMS: '',
    CREATE_ITEM: '',
    UPDATE_ITEM: '/:id',
    DELETE_ITEM: '/:id',
  },

  INVENTORY_MOVEMENT: {
    CONTROLLER: '/inventory-movements',
    GET_MOVEMENTS: '',
    GET_MOVEMENTS_BY_USER: '/by-user/:userId',
    GET_MOVEMENTS_BY_SUPPLIER: '/by-supplier/:supplierId',
    GET_MOVEMENTS_BY_ORDER: '/by-order/:orderId',
    GET_MOVEMENTS_BY_ITEM: '/by-item/:itemId',
    GET_LAST_MOVEMENTS: '/last',
  },

  SUPPLIER: {
    CONTROLLER: '/suppliers',
    GET_SUPPLIER: '/:id',
    GET_SUPPLIERS: '',
    CREATE_SUPPLIER: '',
    UPDATE_SUPPLIER: '/:id',
    DELETE_SUPPLIER: '/:id',
  },

  DISH: {
    CONTROLLER: '/dishes',
    GET_DISH: '/:id',
    GET_DISH_WITH_INGREDIENTS: '/:id/with-ingredients',
    GET_DISHES: '',
    GET_DISHES_WITH_INGREDIENTS: '/with-recipes',
    CREATE_DISH: '',
    UPDATE_DISH: '/:id',
    DELETE_DISH: '/:id',
  },

  CATEGORY_ITEM: {
    CONTROLLER: '/category',
    GET_CATEGORY_ITEM: '/:id',
    GET_CATEGORY_ITEMS: '',
    GET_CATEGORY_ITEMS_BY_TYPE: '/type',
    CREATE_CATEGORY_ITEM: '',
    UPDATE_CATEGORY_ITEM: '/:id',
    DELETE_CATEGORY_ITEM: '/:id',
  },

  RECIPE: {
    CONTROLLER: '/recipe',
    GET_RECIPE: '/:id',
    GET_RECIPES: '',
    CREATE_RECIPE: '',
    UPDATE_RECIPE: '/:id',
    DELETE_RECIPE: '/:id',
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
