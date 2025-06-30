export interface UpdateInventoryItemRequest {
  name: string;
  imagePath: string;
  unitId: string;
  unitCost: number;
  minStockLevel: number;
  supplierId: number;
  categoryId: number;
  location: string;
  expiryDate: string;
  isActive: boolean;
}
