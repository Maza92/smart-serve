import { CashMovementTypeEnum } from '@app/core/enums/cash-movement-enums';

export interface CashMovement {
  id: number;
  cashRegisterId: number;
  cashRegisterStatus: string;
  username: string;
  amount: number;
  movementType: CashMovementTypeEnum;
  reason: string;
  movementDate: Date;
  authorizedBy: string;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
}
