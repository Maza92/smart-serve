import { CategoryType } from '@app/core/enums/category-enums';

export interface CategoryItem {
  id: number;
  name: string;
  description: string;
  categoryType: CategoryType;
  isActive: boolean;
}
