import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CashMovementTypeEnum } from '@app/core/enums/cash-movement-enums';
import { CashMovement } from '@app/core/model/data/cash-movement';
import { LucideAngularModule } from 'lucide-angular';
import { ModalService } from 'ngx-modal-ease';

@Component({
  selector: 'app-cash-movement-detail',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './cash-movement-detail.component.html',
  styleUrls: ['./cash-movement-detail.component.css'],
})
export class CashMovementDetailComponent implements OnInit {
  @Input() movement!: CashMovement;

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {}

  close(): void {
    this.modalService.close();
  }

  getMovementTypeLabel(type: CashMovementTypeEnum): string {
    const labels: Record<CashMovementTypeEnum, string> = {
      [CashMovementTypeEnum.INCOME]: 'Ingreso',
      [CashMovementTypeEnum.EXPENSE]: 'Egreso',
      [CashMovementTypeEnum.ADJUSTMENT_INCOME]: 'Ajuste de Ingreso',
      [CashMovementTypeEnum.ADJUSTMENT_EXPENSE]: 'Ajuste de Egreso',
      [CashMovementTypeEnum.SALE]: 'Venta',
      [CashMovementTypeEnum.REFUND]: 'Reembolso',
    };
    return labels[type] || type;
  }

  getMovementTypeIcon(type: CashMovementTypeEnum): string {
    switch (type) {
      case CashMovementTypeEnum.INCOME:
      case CashMovementTypeEnum.ADJUSTMENT_INCOME:
        return 'arrow-down';
      case CashMovementTypeEnum.EXPENSE:
      case CashMovementTypeEnum.ADJUSTMENT_EXPENSE:
        return 'arrow-up';
      case CashMovementTypeEnum.SALE:
        return 'shopping-cart';
      case CashMovementTypeEnum.REFUND:
        return 'rotate-ccw';
      default:
        return 'circle';
    }
  }

  getMovementStyles(movementType: CashMovementTypeEnum) {
    const styleMap: Record<
      CashMovementTypeEnum,
      { bg: string; text: string; corner: string }
    > = {
      [CashMovementTypeEnum.INCOME]: {
        bg: 'bg-tertiary',
        text: 'text-on-tertiary',
        corner: 'bg-tertiary',
      },
      [CashMovementTypeEnum.ADJUSTMENT_INCOME]: {
        bg: 'bg-error-container',
        text: 'text-on-error-container',
        corner: 'bg-error-container',
      },
      [CashMovementTypeEnum.EXPENSE]: {
        bg: 'bg-error',
        text: 'text-on-error',
        corner: 'bg-error',
      },
      [CashMovementTypeEnum.ADJUSTMENT_EXPENSE]: {
        bg: 'bg-error',
        text: 'text-on-error',
        corner: 'bg-error',
      },
      [CashMovementTypeEnum.SALE]: {
        bg: 'bg-primary-key',
        text: 'text-on-primary-key',
        corner: 'bg-primary-key',
      },
      [CashMovementTypeEnum.REFUND]: {
        bg: 'bg-secondary',
        text: 'text-on-secondary',
        corner: 'bg-secondary',
      },
    };

    return styleMap[movementType] || styleMap[CashMovementTypeEnum.INCOME];
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
