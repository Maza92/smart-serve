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
  selector: 'app-waste-register',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    BasePageComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './waste-register.component.html',
  styleUrl: './waste-register.component.css',
})
export class WasteRegisterComponent implements OnInit {
  selectedItem: InventoryItem | null = null;
  isLoading = false;
  reasonOptions = [
    { value: MovementReasonEnum.DAMAGE, label: 'Daño' },
    { value: MovementReasonEnum.EXPIRY, label: 'Caducidad' },
  ];

  wasteForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private toastService: ToastService,
    private modalService: ModalService,
    private navigationService: NavigationService
  ) {
    this.wasteForm = this.fb.group({
      quantity: [null, [Validators.required, Validators.min(0.01)]],
      reason: [MovementReasonEnum.DAMAGE, Validators.required],
      notes: [''],
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
    if (this.wasteForm.invalid) {
      this.toastService.error('El formulario es inválido');
      return;
    }

    if (!this.selectedItem) {
      this.toastService.warning('Debe seleccionar un producto');
      return;
    }

    const quantity = this.wasteForm.get('quantity')?.value;
    const reason = this.wasteForm.get('reason')?.value;
    const notes = this.wasteForm.get('notes')?.value;

    const updateItem: UpdateInventoryItemStockDto = {
      itemId: this.selectedItem.id,
      movementType: MovementTypeEnum.ADJUSTMENT_OUT,
      quantityChanged: quantity,
      unitCostAtTime: this.selectedItem.unitCost,
      reason: reason,
      referenceId: 0,
      referenceType: ReferenceTypeEnum.MANUAL,
      notes:
        notes ||
        `Merma por ${
          reason === MovementReasonEnum.DAMAGE ? 'daño' : 'caducidad'
        }`,
    };

    this.isLoading = true;
    this.inventoryService.updateStock(updateItem).subscribe(
      (response) => {
        this.toastService.success('Merma registrada correctamente');
        this.resetForm();
        this.isLoading = false;
        this.goToMovements();
      },
      (error) => {
        this.toastService.error(
          'Error al registrar la merma',
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
    this.wasteForm.reset({
      quantity: null,
      reason: MovementReasonEnum.DAMAGE,
      notes: '',
    });
    this.selectedItem = null;
  }
}
