import { TrendTypeEnum } from '../data/inventory-dashboard';

export interface TodaySales {
  totalSales: number;
  trendType: TrendTypeEnum;
  todaySales: number;
}
