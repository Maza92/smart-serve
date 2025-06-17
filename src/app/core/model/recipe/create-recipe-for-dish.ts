export interface CreateRecipeForDishRequest {
  inventoryItemId: number;
  quantityRequired: number;
  notes: string;
  preparationOrder: number;
}
