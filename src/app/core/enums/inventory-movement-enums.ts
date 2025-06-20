export enum InventoryMovementType {
  IN = 'IN',
  OUT = 'OUT',
  ADJUSTMENT = 'ADJUSTMENT',
  WASTE = 'WASTE',
  TRANSFER = 'TRANSFER',
}

export enum InventoryMovementReason {
  PURCHASE = 'PURCHASE',
  RECIPE_USAGE = 'RECIPE_USAGE',
  MANUAL_ADJUSTMENT = 'MANUAL_ADJUSTMENT',
  EXPIRY = 'EXPIRY',
  DAMAGE = 'DAMAGE',
  TRANSFER = 'TRANSFER',
}

export enum InventoryMovementReferenceType {
  ORDER = 'ORDER',
  PURCHASE = 'PURCHASE',
  MANUAL = 'MANUAL',
  TRANSFER = 'TRANSFER',
  RECIPE = 'RECIPE',
}
