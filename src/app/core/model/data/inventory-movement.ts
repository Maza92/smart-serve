import {
  MovementReasonEnum,
  MovementTypeEnum,
  ReferenceTypeEnum,
} from '@app/core/enums/inventory-enums';

export interface InventoryMovement {
  itemId: number;
  itemName: string;
  itemImagePath: string;
  userId: number;
  userName: string;
  movementType: MovementTypeEnum;
  quantityBefore: number;
  quantityAfter: number;
  quantityChanged: number;
  unitCostAtTime: number;
  movementValue: number;
  reason: MovementReasonEnum;
  referenceId: number;
  referenceType: ReferenceTypeEnum;
  notes: string;
  movementDate: Date;
}
