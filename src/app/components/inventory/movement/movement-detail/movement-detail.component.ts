import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  MovementReasonEnum,
  MovementTypeEnum,
} from '@app/core/enums/inventory-enums';
import { InventoryMovement } from '@app/core/model/data/inventory-movement';
import { ToastService } from '@app/lib/toast/toast.service';
import { LucideAngularModule } from 'lucide-angular';
import { ModalService } from 'ngx-modal-ease';

@Component({
  selector: 'app-movement-detail',
  standalone: true,
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './movement-detail.component.html',
  styles: [``],
})
export class MovementDetailComponent implements OnInit {
  @Input() movement: InventoryMovement | null = null;
  constructor(
    private toastService: ToastService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    if (!this.movement) {
      this.toastService.error('Error', 'Movimiento invalido');
      this.closeModal();
    }
  }

  closeModal() {
    this.modalService.close();
  }

  getMovementReason(reason?: MovementReasonEnum) {
    switch (reason) {
      case MovementReasonEnum.PURCHASE:
        return 'compra';
      case MovementReasonEnum.RECIPE_USAGE:
        return 'uso de receta';
      case MovementReasonEnum.MANUAL_ADJUSTMENT:
        return 'ajuste manual';
      case MovementReasonEnum.EXPIRY:
        return 'vencimiento';
      case MovementReasonEnum.DAMAGE:
        return 'daño';
      case MovementReasonEnum.TRANSFER:
        return 'transferencia';
      default:
        return 'Otro';
    }
  }

  getMovementStyles(movementType?: MovementTypeEnum) {
    if (!movementType) return { text: 'text-red-700' };

    const styleMap = {
      IN: {
        text: 'text-green-700',
      },
      TRANSFER_IN: {
        text: 'text-green-700',
      },
      OUT: {
        text: 'text-red-700',
      },
      TRANSFER_OUT: {
        text: 'text-red-700',
      },
      ADJUSTMENT_OUT: {
        text: 'text-red-700',
      },
      ADJUSTMENT_IN: {
        text: 'text-primary-key',
      },
    };

    return styleMap[movementType] || styleMap['OUT'];
  }
}
