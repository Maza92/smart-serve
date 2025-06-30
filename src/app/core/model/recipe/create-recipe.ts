export interface CreateRecipeRequest {
  inventoryItemId: number;
  quantityRequired: number;
  unitId: number;
  notes: string;
  preparationOrder: number;
  dishId: number;
}
