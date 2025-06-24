import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  MovementReasonEnum,
  MovementTypeEnum,
} from '@app/core/enums/inventory-enums';
import { InventoryItem } from '@app/core/model/data/inventory-item';
import { InventoryMovement } from '@app/core/model/data/inventory-movement';
import { InventoryItemService } from '@app/core/service/inventory-item.service';
import { InventoryMovementService } from '@app/core/service/inventory-movement.service';
import { ToastService } from '@app/lib/toast/toast.service';
import { BasePageComponent } from '@app/shared/base-page/base-page.component';
import { LucideAngularModule } from 'lucide-angular';
import { Subject, finalize, takeUntil } from 'rxjs';

@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [BasePageComponent, CommonModule, LucideAngularModule],
  templateUrl: './item-details.component.html',
  styleUrl: './item-details.component.css',
})
export class ItemDetailsComponent implements OnInit, OnDestroy {
  activeTab = 1;
  item: InventoryItem | null = null;
  id: number | null = null;
  movements: InventoryMovement[] = [];
  page = 1;
  size = 10;
  loading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private inventoryItemService: InventoryItemService,
    private inventoryMovementService: InventoryMovementService,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    if (!this.id) return;

    this.loadItemDetails();
    this.loadMovements();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadItemDetails(): void {
    this.inventoryItemService.getInventoryItemById(this.id!).subscribe({
      next: (response) => {
        this.item = response.data;
      },
      error: (error) => {
        this.toastService.error(error.message);
      },
    });
  }

  loadMovements(): void {
    if (!this.id || this.loading) return;

    this.loading = true;

    this.inventoryMovementService
      .getMovementsByItemId(this.page, this.size, this.id)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.loading = false))
      )
      .subscribe({
        next: (response) => {
          this.movements = response.data.content;
        },
        error: (error) => {
          this.toastService.error(error.message);
        },
      });
  }

  getIconNameByMovementType(type: MovementTypeEnum): string {
    switch (type) {
      case MovementTypeEnum.IN:
      case MovementTypeEnum.TRANSFER_IN:
      case MovementTypeEnum.ADJUSTMENT_IN:
        return 'arrow-down';
      case MovementTypeEnum.OUT:
      case MovementTypeEnum.TRANSFER_OUT:
      case MovementTypeEnum.ADJUSTMENT_OUT:
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
      default:
        return reason;
    }
  }

  getMovementStyles(movementType: MovementTypeEnum) {
    const styleMap: any = {
      [MovementTypeEnum.IN]: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        corner: 'bg-green-700',
      },
      [MovementTypeEnum.TRANSFER_IN]: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        corner: 'bg-green-700',
      },
      [MovementTypeEnum.OUT]: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        corner: 'bg-red-700',
      },
      [MovementTypeEnum.TRANSFER_OUT]: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        corner: 'bg-red-700',
      },
      [MovementTypeEnum.ADJUSTMENT_OUT]: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        corner: 'bg-red-700',
      },
      [MovementTypeEnum.ADJUSTMENT_IN]: {
        bg: 'bg-orange-100',
        text: 'text-primary-key',
        corner: 'bg-primary-key',
      },
    };

    return styleMap[movementType] || styleMap[MovementTypeEnum.OUT];
  }

  getStockPinText(item: InventoryItem | null): string {
    if (!item) return 'Sin stock';
    if (!item.stockQuantity) return 'Sin stock';
    if (!item.minStockLevel) return 'Sin stock mínimo';

    return item.stockQuantity > item.minStockLevel
      ? 'Buen stock'
      : 'Stock bajo';
  }
}
