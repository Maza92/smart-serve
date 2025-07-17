import { CashMovementTypeEnum } from '@app/core/enums/cash-movement-enums';

export interface CreateCashMovementRequest {
  cashRegisterId: number;
  amount: number;
  movementType: CashMovementTypeEnum;
  reason?: string;
  authorizedBy?: string;
}
