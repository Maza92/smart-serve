import { TableStatusEnum } from '@app/core/enums/table-enum';

export interface RestaurantTable {
  id: number;
  number: number;
  capacity: number;
  status: TableStatusEnum;
  section: string;
}
