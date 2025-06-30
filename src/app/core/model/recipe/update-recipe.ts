export interface UpdateRecipeRequest {
  inventoryItemId: number;
  unitId: number;
  quantityRequired: number;
  notes: string;
  preparationOrder: number;
}
