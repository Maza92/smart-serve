import { IngredientSummary, RecipeSummary } from './recipe';

export interface Dish {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  categoryId: number;
  imageUrl: string;
  preparationTime: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DishWithIngredients {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  preparationTime: number;
  isFeatured: boolean;
  recipes: RecipeSummary[];
}

export interface DishWithIngredientsToUpdate {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  categoryId: number;
  imageUrl: string;
  preparationTime: number;
  ingredients: IngredientSummary[];
}
