export interface CategoryMetric {
  currentCount: number;
  newCategoriesThisMonth: number;
  changeDescription: string;
}

export interface CategoryStockLevel {
  categoryName: string;
  stockPercentage: number;
  totalItems: number;
  lowStockItems: number;
  totalValue: number;
}

export interface DashboardUpdate {
  updateType: UpdateTypeEnum;
  data: any;
  timestamp: string;
}
export interface RecentActivity {
  id: string;
  activityType: ActivityTypeEnum;
  description: string;
  userName: string;
  timestamp: Date;
  timeAgo: string;
  metadata: { [key: string]: any };
}

export interface TotalItemsMetric {
  currentCount: number;
  percentageChange: number;
  trend: TrendTypeEnum;
  changeDescription: string;
}

export interface LowStockItem {
  itemId: number;
  itemName: string;
  currentStock: number;
  minStockLevel: number;
  unitName: string;
  categoryName: string;
}

export interface LowStockMetric {
  currentCount: number;
  percentageChange: number;
  trend: TrendTypeEnum;
  changeDescription: string;
  items: LowStockItem[];
}

export interface TotalValueMetric {
  currentValue: number;
  percentageChange: number;
  trend: TrendTypeEnum;
  changeDescription: string;
}

export interface CategoriesMetric {
  currentCount: number;
  newCategoriesThisMonth: number;
  changeDescription: string;
}

export interface InventoryMetrics {
  totalItems: TotalItemsMetric;
  lowStock: LowStockMetric;
  totalValue: TotalValueMetric;
  categories: CategoriesMetric;
}

export interface InventoryDashboard {
  metrics: InventoryMetrics;
  categoryStockLevels: CategoryStockLevel[];
  recentActivities: RecentActivity[];
  lastUpdated: string;
}

export enum UpdateTypeEnum {
  METRICS_UPDATE = 'METRICS_UPDATE',
  STOCK_LEVEL_UPDATE = 'STOCK_LEVEL_UPDATE',
  NEW_ACTIVITY = 'NEW_ACTIVITY',
  LOW_STOCK_ALERT = 'LOW_STOCK_ALERT',
}

export enum TrendTypeEnum {
  UP = 'UP',
  DOWN = 'DOWN',
  STABLE = 'STABLE',
}

export enum ActivityTypeEnum {
  INVENTORY_PURCHASE = 'INVENTORY_PURCHASE',
  INVENTORY_ADJUSTMENT = 'INVENTORY_ADJUSTMENT',
  INVENTORY_EXPIRY = 'INVENTORY_EXPIRY',
  ORDER_COMPLETED = 'ORDER_COMPLETED',
  LOW_STOCK_ALERT = 'LOW_STOCK_ALERT',
  CATEGORY_CREATED = 'CATEGORY_CREATED',
  ITEM_CREATED = 'ITEM_CREATED',
}
