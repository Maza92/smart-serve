import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BasePageComponent } from '@app/shared/base-page/base-page.component';
import { LucideAngularModule } from 'lucide-angular';
import { InventoryService } from '@app/core/service/inventory.service';
import { ToastService } from '@app/lib/toast/toast.service';
import { ModalService } from 'ngx-modal-ease';
import { InventoryItem } from '@app/core/model/data/inventory-item';
import { ItemSelectComponent } from '@app/shared/item-select/item-select.component';
import {
  MovementReasonEnum,
  MovementTypeEnum,
  ReferenceTypeEnum,
} from '@app/core/enums/inventory-enums';
import { UpdateInventoryItemStockDto } from '@app/core/model/inventory/update-inventory-item-stock';
import { NavigationService } from '@app/core/service/navigation.service';
import { GoToDirective } from '@app/shared/directives/go-to.directive';

@Component({
  selector: 'app-manual-adjustment',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    BasePageComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './manual-adjustment.component.html',
  styles: [``],
})
export class ManualAdjustmentComponent implements OnInit {
  selectedItem: InventoryItem | null = null;
  isLoading = false;

  adjustmentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private toastService: ToastService,
    private modalService: ModalService,
    private navigationService: NavigationService
  ) {
    this.adjustmentForm = this.fb.group({
      quantity: [null, Validators.required],
      movementType: [MovementTypeEnum.ADJUSTMENT_IN, Validators.required],
      notes: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.navigationService.configureNavbar(['home', 'settings']);
  }

  openItemSelectModal() {
    this.modalService
      .open(ItemSelectComponent, {
        modal: {
          enter: 'enter-scaling 0.1s ease-out',
          leave: 'fade-out 0.1s ease-out',
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
          maxHeight: '80vh',
        },
        actions: {
          escape: true,
          click: true,
        },
      })
      .then((result) => {
        if (!result || !result.data) return;
        this.selectedItem = result.data as InventoryItem;
        this.toastService.success(
          `Producto seleccionado: ${this.selectedItem.name}`
        );
      });
  }

  saveMovement() {
    if (this.adjustmentForm.invalid) {
      this.toastService.error('El formulario es inválido');
      return;
    }

    if (!this.selectedItem) {
      this.toastService.warning('Debe seleccionar un producto');
      return;
    }

    const quantity = this.adjustmentForm.get('quantity')?.value;
    const notes = this.adjustmentForm.get('notes')?.value;
    const movementType = this.adjustmentForm.get('movementType')?.value;

    const absQuantity = Math.abs(quantity);

    const updateItem: UpdateInventoryItemStockDto = {
      itemId: this.selectedItem.id,
      movementType: movementType,
      quantityChanged: absQuantity,
      unitCostAtTime: this.selectedItem.unitCost,
      reason: MovementReasonEnum.MANUAL_ADJUSTMENT,
      referenceId: 0,
      referenceType: ReferenceTypeEnum.MANUAL,
      notes: notes || 'Ajuste manual de inventario',
    };

    this.isLoading = true;
    this.inventoryService.updateStock(updateItem).subscribe(
      (response) => {
        this.toastService.success('Ajuste registrado correctamente');
        this.resetForm();
        this.isLoading = false;
        this.goToMovements();
      },
      (error) => {
        this.toastService.error(
          'Error al registrar el ajuste',
          error.error?.message || 'Error desconocido'
        );
        this.isLoading = false;
      }
    );
  }

  goToMovements() {
    this.resetForm();
    this.navigationService.goTo('movements');
  }

  resetForm() {
    this.adjustmentForm.reset({
      quantity: null,
      notes: '',
    });
    this.selectedItem = null;
  }
}
