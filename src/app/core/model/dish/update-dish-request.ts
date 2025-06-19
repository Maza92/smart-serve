import { RecipeSummary } from '../data/recipe';

export interface UpdateDishRequest {
  name?: string;
  description?: string;
  basePrice?: number;
  categoryId?: string;
  imageUrl?: string;
  preparationTime?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  recipes?: RecipeSummary[];
}
