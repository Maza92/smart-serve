import {
  MovementReasonEnum,
  MovementTypeEnum,
  ReferenceTypeEnum,
} from '@app/core/enums/inventory-enums';

export interface InventoryMovement {
  itemId: number;
  itemName: string;
  userId: number;
  movementType: MovementTypeEnum;
  quantityBefore: number;
  quantityAfter: number;
  quantityChanged: number;
  unitCostAtTime: number;
  reason: MovementReasonEnum;
  referenceId: number;
  referenceType: ReferenceTypeEnum;
  notes: string;
  movementDate: Date;
}
