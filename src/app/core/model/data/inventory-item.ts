export interface InventoryItem {
  id: number;
  name: string;
  imagePath: string;
  unit: string;
  stockQuantity: number;
  unitCost: number;
  minStockLevel: number;
  supplierName: string;
  supplierId: number;
  categoryId: number;
  location: string;
  lastUpdated: string;
  expiryDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
