export interface UpdateInventoryItemRequest {
  name: string;
  unit: string;
  unitCost: number;
  minStockLevel: number;
  supplierId: number;
  location: string;
  expiryDate: string;
  isActive: boolean;
}
