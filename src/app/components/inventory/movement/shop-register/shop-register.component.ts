import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BasePageComponent } from '@app/shared/base-page/base-page.component';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { SupplierService } from '@app/core/service/supplier.service';
import { InventoryItemService } from '@app/core/service/inventory-item.service';
import { InventoryService } from '@app/core/service/inventory.service';
import { ToastService } from '@app/lib/toast/toast.service';
import { ModalService } from 'ngx-modal-ease';
import { Supplier } from '@app/core/model/data/supplier';
import { InventoryItem } from '@app/core/model/data/inventory-item';
import { ItemSelectMultipleComponent } from './item-select-multiple/item-select-multiple.component';
import {
  MovementReasonEnum,
  MovementTypeEnum,
  ReferenceTypeEnum,
} from '@app/core/enums/inventory-enums';
import { UpdateInventoryItemStockDto } from '@app/core/model/inventory/update-inventory-item-stock';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { GoToDirective } from '@app/shared/directives/go-to.directive';
import { NavigationService } from '@app/core/service/navigation.service';

interface ItemMovement {
  item: InventoryItem;
  quantity: number;
  unitCost?: number;
}

@Component({
  selector: 'app-shop-register',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    BasePageComponent,
    FormsModule,
    ReactiveFormsModule,
    GoToDirective,
  ],
  templateUrl: './shop-register.component.html',
  styleUrl: './shop-register.component.css',
})
export class ShopRegisterComponent implements OnInit {
  suppliers: Supplier[] = [];
  selectedItems: ItemMovement[] = [];
  isLoading = false;
  searchSubject = new Subject<string>();
  searchInput = '';
  page = 1;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  movementForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private navigationService: NavigationService,
    private inventoryService: InventoryService,
    private toastService: ToastService,
    private modalService: ModalService
  ) {
    this.movementForm = this.fb.group({
      supplier: [null, Validators.required],
      notes: [''],
    });
  }

  ngOnInit(): void {
    this.loadSuppliers();
    this.navigationService.configureNavbar(['home', 'settings']);

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.resetAndLoad();
      });
  }

  resetAndLoad() {
    this.page = 1;
    this.loadSuppliers();
  }

  clearSearch() {
    this.searchInput = '';
    this.resetAndLoad();
  }

  loadSuppliers() {
    this.isLoading = true;
    this.supplierService
      .getSuppliers(this.page, this.pageSize, {
        search: this.searchInput,
        status: 'active',
        sortBy: 'name',
        sortDirection: 'asc',
      })
      .subscribe(
        (res) => {
          this.suppliers = res.data.content;
          this.totalElements = res.data.totalElements;
          this.totalPages = res.data.totalPages;
          this.isLoading = false;
        },
        (error) => {
          this.toastService.error(
            'Error',
            'No se pudieron cargar los proveedores'
          );
          this.isLoading = false;
        }
      );
  }

  onSearchChange(searchTerm: string) {
    this.searchSubject.next(searchTerm);
  }

  onSupplierChange() {
    this.selectedItems = [];
  }

  openItemSelectModal() {
    const supplier = this.movementForm.get('supplier')?.value;
    if (!supplier) {
      this.toastService.warning('Debe seleccionar un proveedor primero');
      return;
    }

    this.modalService
      .open(ItemSelectMultipleComponent, {
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
        data: {
          supplierId: supplier.id,
        },
      })
      .then((result) => {
        if (!result || !result.data) return;
        const items = result.data as InventoryItem[];

        const newItems = items.map((item) => ({
          item,
          quantity: 0,
          unitCost: item.unitCost,
        }));

        newItems.forEach((newItem) => {
          if (
            !this.selectedItems.some(
              (existingItem) => existingItem.item.id === newItem.item.id
            )
          ) {
            this.selectedItems.push(newItem);
          }
        });

        if (items.length > 0) {
          this.toastService.success(`Se agregaron ${items.length} productos`);
        }
      });
  }

  removeItem(index: number) {
    this.selectedItems.splice(index, 1);
  }

  saveMovement() {
    if (this.movementForm.invalid) {
      this.toastService.error('El formulario es inválido');
      return;
    }

    if (this.selectedItems.length === 0) {
      this.toastService.warning('Debe seleccionar al menos un producto');
      return;
    }

    const validItems = this.selectedItems.filter((item) => item.quantity > 0);

    if (validItems.length === 0) {
      this.toastService.warning(
        'Debe ingresar una cantidad mayor a 0 para al menos un producto'
      );
      return;
    }

    const supplier = this.movementForm.get('supplier')?.value;
    const note = this.movementForm.get('notes')?.value;

    const updateItems: UpdateInventoryItemStockDto[] = validItems.map(
      (item) => ({
        itemId: item.item.id,
        movementType: MovementTypeEnum.IN,
        quantityChanged: item.quantity,
        unitCostAtTime: item.unitCost || item.item.unitCost,
        reason: MovementReasonEnum.PURCHASE,
        referenceId: supplier.id,
        referenceType: ReferenceTypeEnum.PURCHASE,
        notes: note || `Compra a ${supplier.name}`,
      })
    );

    this.isLoading = true;
    this.inventoryService.updateStockBatch(updateItems).subscribe(
      (response) => {
        this.toastService.success('Movimiento registrado correctamente');
        this.resetForm();
        this.isLoading = false;
        this.goToMovements();
      },
      (error) => {
        this.toastService.error(
          'Error al registrar el movimiento',
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
    this.movementForm.reset();
    this.selectedItems = [];
  }
}
