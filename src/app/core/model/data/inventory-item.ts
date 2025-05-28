export interface InventoryItem {
  id: number;
  name: string;
  unit: string;
  stockQuantity: number;
  unitCost: number;
  minStockLevel: number;
  supplierName: string;
  supplierId: number;
  location: string;
  lastUpdated: string;
  expiryDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
