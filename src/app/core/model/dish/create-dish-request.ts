import { CreateRecipeForDishRequest } from '../recipe/create-recipe-for-dish';

export interface CreateDishRequest {
  name: string;
  description: string;
  basePrice: number;
  category: string;
  imageUrl: string;
  preparationTime: number;
  ingredients: CreateRecipeForDishRequest[];
}
