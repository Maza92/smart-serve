import { IngredientSummary } from '../data/recipe';

export interface IngredientWithStatus extends IngredientSummary {
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
