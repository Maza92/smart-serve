export interface UpdateRecipeRequest {
  inventoryItemId: number;
  quantityRequired: number;
  notes: string;
  preparationOrder: number;
}
