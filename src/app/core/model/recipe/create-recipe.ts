export interface CreateRecipeRequest {
  inventoryItemId: number;
  quantityRequired: number;
  notes: string;
  preparationOrder: number;
  dishId: number;
}
