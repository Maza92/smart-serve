import { InventoryItem } from './inventory-item';

export interface Recipe {
  id: number;
  inventoryItem: InventoryItem;
  quantityRequired: number;
  notes: string;
  preparationOrder: number;
}

export interface RecipeSummary {
  name: string;
  quantityRequired: number;
  unit: string;
}

export interface IngredientSummary {
  recipeId: number;
  inventoryItemId: number;
  quantityRequired: number;
  notes: string;
  preparationOrder: number;
}
