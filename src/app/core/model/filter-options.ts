import { CashMovementTypeEnum } from '../enums/cash-movement-enums';

export interface BaseSortOptions {
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface BaseSearchFilterOptions extends BaseSortOptions {
  search?: string;
  status?: 'active' | 'inactive' | null;
}

export interface BaseRequiredSortFilterOptions extends BaseSearchFilterOptions {
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}

export interface BaseDateFilterOptions extends BaseSortOptions {
  startDate?: Date;
  endDate?: Date;
}

export interface BasePriceFilterOptions {
  minPrice?: number;
  maxPrice?: number;
}

export interface FilterOptions extends BaseRequiredSortFilterOptions {
  role?: string | null;
}

export interface CashMovementFilterOptions extends BaseDateFilterOptions {
  cashRegisterId?: number;
  userId?: number;
  movementType?: CashMovementTypeEnum;
}

export interface InventoryItemsFilterOptions
  extends BaseRequiredSortFilterOptions {
  location?: string;
}

export interface DishFilterOptions
  extends BaseRequiredSortFilterOptions,
    BasePriceFilterOptions {
  category?: string;
  isFeatured?: boolean;
}

export interface ChipFilter {
  type: 'status' | 'role' | 'sort' | 'movementType' | 'date';
  value: string;
  label: string;
}

export enum RoleEnum {
  ADMIN = 'ADMIN',
  USER = 'USER',
  CASHIER = 'CASHIER',
  WAITER = 'WAITER',
  COOK = 'COOK',
}

export const RoleLabels: Record<RoleEnum, string> = {
  [RoleEnum.ADMIN]: 'Administrador',
  [RoleEnum.USER]: 'Usuario',
  [RoleEnum.CASHIER]: 'Cajero',
  [RoleEnum.WAITER]: 'Mesero',
  [RoleEnum.COOK]: 'Cocinero',
};
