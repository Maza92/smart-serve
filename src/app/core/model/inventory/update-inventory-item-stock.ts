import {
  MovementReasonEnum,
  MovementTypeEnum,
  ReferenceTypeEnum,
} from '@app/core/enums/inventory-enums';

export interface UpdateInventoryItemStockDto {
  itemId: number;
  movementType: MovementTypeEnum;
  quantityChanged: number;
  unitCostAtTime: number;
  reason: MovementReasonEnum;
  referenceId: number;
  referenceType: ReferenceTypeEnum;
  note: string;
}
