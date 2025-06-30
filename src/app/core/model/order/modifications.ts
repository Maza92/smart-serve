export enum OrderModificationAction {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
  EXTRA = 'EXTRA',
  LESS = 'LESS',
  NOTE = 'NOTE',
}

export interface OrderModification {
  inventoryItemId: number;
  ingredientName: string;
  action: OrderModificationAction;
  quantityChange: number;
  unitId: number;
  priceAdjustment: number;
}
