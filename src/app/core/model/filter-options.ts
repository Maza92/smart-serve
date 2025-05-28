export interface BaseFilterOptions {
  search?: string;
  status?: 'active' | 'inactive' | null;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}

export interface FilterOptions extends BaseFilterOptions {
  role?: string | null;
}

export interface InventoryItemsFilterOptions extends BaseFilterOptions {
  location?: string;
}

export interface ChipFilter {
  type: 'status' | 'role' | 'sort';
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
