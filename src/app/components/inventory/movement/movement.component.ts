import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasePageComponent } from '@app/shared/base-page/base-page.component';
import { LucideAngularModule, Move } from 'lucide-angular';
import { ModalService } from 'ngx-modal-ease';
import { OptionSelectComponent } from './option-select/option-select.component';
import { Router } from '@angular/router';
import { InventoryMovement } from '@app/core/model/data/inventory-movement';
import { finalize, Subject, takeUntil } from 'rxjs';
import { InventoryMovementService } from '@app/core/service/inventory-movement.service';
import { NavigationService } from '@app/core/service/navigation.service';
import { ToastService } from '@app/lib/toast/toast.service';
import { CommonModule } from '@angular/common';
import {
  MovementReasonEnum,
  MovementTypeEnum,
} from '@app/core/enums/inventory-enums';
import { BackBarComponent } from '@app/shared/back-bar/back-bar.component';
import { MovementDetailComponent } from './movement-detail/movement-detail.component';

@Component({
  selector: 'app-movement',
  standalone: true,
  imports: [
    BasePageComponent,
    LucideAngularModule,
    CommonModule,
    BackBarComponent,
  ],
  templateUrl: './movement.component.html',
  styleUrl: './movement.component.css',
})
export class MovementComponent implements OnInit, OnDestroy {
  movements: InventoryMovement[] = [];
  page = 1;
  size = 5;
  hasMore = true;
  loading = false;
  totalMovements = 0;

  path: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private inventoryMovementService: InventoryMovementService,
    private toastService: ToastService,
    private modalService: ModalService,
    private navigationService: NavigationService
  ) {}
  ngOnInit(): void {
    this.loadMovements();
    this.navigationService.configureNavbar(['home', 'items', 'settings']);
  }

  openOptionSelectModal() {
    this.modalService.open(OptionSelectComponent, {
      modal: {
        enter: 'enter-going-up 0.1s ease-out',
        leave: 'leave-going-down 0.1s ease-out',
        top: '50%',
        left: '50%',
      },
      overlay: {
        enter: 'fade-in 0.3s ease-out',
        leave: 'fade-out 0.2s ease-in',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },

      size: {
        width: '100%',
        height: '334px',
        padding: '0px 0.5rem',
      },
      actions: {
        escape: true,
        click: true,
      },
    });
  }

  openMovementDetailModal(movement: InventoryMovement) {
    this.modalService.open(MovementDetailComponent, {
      modal: {
        enter: 'enter-going-up 0.1s ease-out',
        leave: 'leave-going-down 0.1s ease-out',
        top: '50%',
        left: '50%',
      },
      overlay: {
        enter: 'fade-in 0.3s ease-out',
        leave: 'fade-out 0.2s ease-in',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },

      size: {
        width: '85%',
        height: '90%',
        padding: '0',
      },
      actions: {
        escape: true,
        click: true,
      },
      data: {
        movement: movement,
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMovements(loadMore: boolean = false) {
    if (this.loading) return;

    if (loadMore) {
      this.page++;
    }

    this.loading = true;

    this.inventoryMovementService
      .getLastMovements(this.page, this.size)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.loading = false))
      )
      .subscribe({
        next: (response) => {
          const newData = response.data.content;

          if (loadMore) {
            this.movements = [...this.movements, ...newData];
          } else {
            this.movements = newData;
          }

          this.totalMovements = response.data.totalElements;
          this.hasMore = !response.data.last;
        },
        error: (error) => {
          this.toastService.error('Error', error.message, {
            position: 'top-center',
            showCloseButton: false,
            showProgressBar: false,
            duration: 3000,
          });
        },
      });
  }

  resetAndLoad() {
    this.page = 1;
    this.loadMovements();
  }

  loadMore(): void {
    if (this.hasMore && !this.loading) {
      this.loadMovements(true);
    }
  }

  getIconNameByMovementType(type: MovementTypeEnum): string {
    switch (type) {
      case (MovementTypeEnum.IN,
      MovementTypeEnum.TRANSFER_IN,
      MovementTypeEnum.ADJUSTMENT_IN):
        return 'arrow-down';
      case (MovementTypeEnum.OUT,
      MovementTypeEnum.TRANSFER_OUT,
      MovementTypeEnum.ADJUSTMENT_OUT):
        return 'arrow-up';
      default:
        return 'arrow-down';
    }
  }

  getMovementReason(reason: MovementReasonEnum): string {
    switch (reason) {
      case MovementReasonEnum.PURCHASE:
        return 'Compra';
      case MovementReasonEnum.RECIPE_USAGE:
        return 'Uso de receta';
      case MovementReasonEnum.MANUAL_ADJUSTMENT:
        return 'Ajuste manual';
      case MovementReasonEnum.EXPIRY:
        return 'Vencimiento';
      case MovementReasonEnum.DAMAGE:
        return 'Daño';
      case MovementReasonEnum.TRANSFER:
        return 'Transferencia';
    }
  }

  getMovementStyles(movementType: MovementTypeEnum) {
    const styleMap = {
      IN: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        corner: 'bg-green-700',
      },
      TRANSFER_IN: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        corner: 'bg-green-700',
      },
      OUT: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        corner: 'bg-red-700',
      },
      TRANSFER_OUT: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        corner: 'bg-red-700',
      },
      ADJUSTMENT_OUT: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        corner: 'bg-red-700',
      },
      ADJUSTMENT_IN: {
        bg: 'bg-orange-100',
        text: 'text-primary-key',
        corner: 'bg-primary-key',
      },
    };

    return styleMap[movementType] || styleMap['OUT'];
  }
}
