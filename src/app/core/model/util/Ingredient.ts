import { IngredientSummary, IngredientToDish } from '../data/recipe';

export interface IngredientWithStatus extends IngredientToDish {
  status: IngredientStatus;
  isUpdating: boolean;
  updateTimeout?: any;
  inventoryItemName?: string;
}

export type IngredientStatus =
  | 'existing'
  | 'creating'
  | 'updating'
  | 'deleting';
