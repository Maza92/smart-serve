export interface CreateRecipeForDishRequest {
  inventoryItemId: number;
  quantityRequired: number;
  unitId: number;
  notes: string;
  preparationOrder: number;
}
