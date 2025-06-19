import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { InventoryItem } from '@app/core/model/data/inventory-item';
import { Supplier } from '@app/core/model/data/supplier';
import {
  InventoryItemsFilterOptions,
  ChipFilter,
  BaseFilterOptions,
} from '@app/core/model/filter-options';
import { CreateInventoryItemRequest } from '@app/core/model/inventory-item/create-inventory-item';
import { UpdateInventoryItemRequest } from '@app/core/model/inventory-item/update-inventory-item';
import { InventoryItemService } from '@app/core/service/inventory-item.service';
import { SupplierService } from '@app/core/service/supplier.service';
import { ToastService } from '@app/lib/toast/toast.service';
import { BackBarComponent } from '@app/shared/back-bar/back-bar.component';
import { BasePageComponent } from '@app/shared/base-page/base-page.component';
import { LucideAngularModule } from 'lucide-angular';
import { ModalService } from 'ngx-modal-ease';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  finalize,
  takeUntil,
} from 'rxjs';
import { FilterChipComponent } from './filter-chip/filter-chip.component';
import { FilterBottomSheetComponent } from './filter-bottom-sheet/filter-bottom-sheet.component';
import { CreateItemComponent } from './create-item/create-item.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { AlertService } from '@app/lib/alert/alert.service';
import { NavigationService } from '@app/core/service/navigation.service';
import { CategoryItem } from '@app/core/model/data/category-item';
import { CategoryItemService } from '@app/core/service/category-item.service';
import { CategoryType } from '@app/core/enums/category-enums';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [
    CommonModule,
    BasePageComponent,
    BackBarComponent,
    LucideAngularModule,
    FormsModule,
    ReactiveFormsModule,
    FilterChipComponent,
    RouterLink,
  ],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css',
})
export class ItemsComponent implements OnInit, OnDestroy {
  private startX: number = 0;
  private currentX: number = 0;
  private threshold: number = 50;
  private swipedCardIndex: number | null = null;

  items: InventoryItem[] = [];
  page = 1;
  size = 10;
  hasMore = true;
  loading = false;

  filters: InventoryItemsFilterOptions = {
    search: '',
    status: null,
    location: '',
    sortBy: 'name',
    sortDirection: 'asc',
  };
  activeFilters: ChipFilter[] = [];
  searchInput = '';
  searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  itemForm!: FormGroup;
  suppliers: Supplier[] = [];
  categories: CategoryItem[] = [];
  isEditMode = false;
  currentItemId: number | null = null;

  path: string | null = null;

  constructor(
    private inventoryItemService: InventoryItemService,
    private supplierService: SupplierService,
    private modalService: ModalService,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private navigationService: NavigationService,
    private categoryItemService: CategoryItemService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.path = this.navigationService.getCurrentComponentPath();

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.filters.search = value;
        this.resetAndLoad();
      });
    this.navigationService.addExclusions(
      [
        'Inventario',
        'Ajustes',
        'Caja',
        'Reportes',
        'Productos',
        'Clientes',
        'Proveedores',
      ],
      this.path
    );

    this.loadItems();
    this.loadSuppliers();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onTouchStart(event: TouchEvent, index: number): void {
    this.startX = event.touches[0].clientX;
    this.currentX = this.startX;

    if (this.swipedCardIndex !== null && this.swipedCardIndex !== index) {
      this.resetSwipedCard();
    }
  }

  onTouchMove(event: TouchEvent, index: number): void {
    if (!event.touches[0]) return;

    this.currentX = event.touches[0].clientX;
    const diffX = this.startX - this.currentX;

    if (diffX > 0) {
      const card = event.currentTarget as HTMLElement;
      const translateX = Math.min(diffX, 120);

      card.style.transform = `translateX(-${translateX}px)`;
    }
  }

  onTouchEnd(event: TouchEvent, index: number): void {
    const diffX = this.startX - this.currentX;
    const card = event.currentTarget as HTMLElement;

    if (diffX > this.threshold) {
      card.style.transform = 'translateX(-120px)';
      card.classList.add('swiped');
      this.swipedCardIndex = index;
    } else {
      card.style.transform = 'translateX(0)';
      card.classList.remove('swiped');
      this.swipedCardIndex = null;
    }
  }

  private resetSwipedCard(): void {
    if (this.swipedCardIndex !== null) {
      const cards = document.querySelectorAll('.item-card');
      const card = cards[this.swipedCardIndex] as HTMLElement;

      if (card) {
        card.style.transform = 'translateX(0)';
        card.classList.remove('swiped');
      }

      this.swipedCardIndex = null;
    }
  }

  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  filterByStatus(status: 'active' | 'inactive' | null): void {
    if (this.filters.status === status) {
      this.filters.status = null;
    } else {
      this.filters.status = status;
    }
    this.updateActiveFilters();
    this.resetAndLoad();
  }

  openFilterModal(): void {
    this.modalService
      .open(FilterBottomSheetComponent, {
        modal: {
          enter: 'enter-scaling 0.1s ease-out',
          leave: 'fade-out 0.1s ease-out',
          top: '50',
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
        data: { currentFilters: this.filters },
      })
      .then((result) => {
        const filterResult = result.data as InventoryItemsFilterOptions | null;
        if (filterResult) {
          this.filters = filterResult;
          this.updateActiveFilters();
          this.resetAndLoad();
        }
      });
  }

  updateActiveFilters(): void {
    this.activeFilters = [];

    if (this.filters.status) {
      this.activeFilters.push({
        type: 'status',
        value: this.filters.status,
        label: this.filters.status === 'active' ? 'Activo' : 'Inactivo',
      });
    }

    if (this.filters.location) {
      this.activeFilters.push({
        type: 'status',
        value: this.filters.location,
        label: `Ubicación: ${this.filters.location}`,
      });
    }

    if (
      this.filters.sortBy !== 'name' ||
      this.filters.sortDirection !== 'asc'
    ) {
      const sortLabel = this.getSortLabel();
      this.activeFilters.push({
        type: 'sort',
        value: `${this.filters.sortBy}_${this.filters.sortDirection}`,
        label: sortLabel,
      });
    }
  }

  getSortLabel(): string {
    const fieldMap: Record<string, string> = {
      name: 'Nombre',
      stockQuantity: 'Stock',
      unitCost: 'Costo',
      supplierName: 'Proveedor',
    };

    const directionMap: Record<string, string> = {
      asc: '↑',
      desc: '↓',
    };

    return `${fieldMap[this.filters.sortBy] || this.filters.sortBy} ${
      directionMap[this.filters.sortDirection] || ''
    }`;
  }

  removeFilter(filter: ChipFilter): void {
    switch (filter.type) {
      case 'status':
        if (filter.value === 'active' || filter.value === 'inactive') {
          this.filters.status = null;
        } else {
          this.filters.location = '';
        }
        break;
      case 'sort':
        this.filters.sortBy = 'name';
        this.filters.sortDirection = 'asc';
        break;
    }

    this.updateActiveFilters();
    this.resetAndLoad();
  }

  loadItems(loadMore: boolean = false): void {
    if (this.loading) return;

    if (loadMore) {
      this.page++;
    }

    this.loading = true;

    this.inventoryItemService
      .getInventoryItems(this.page, this.size, this.filters)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          const newData = response.data.content;

          if (loadMore) {
            this.items = [...this.items, ...newData];
          } else {
            this.items = newData;
          }

          this.hasMore = newData.length === this.size;
        },
        error: (error) => {
          this.toastService.error('Error', error.message);
        },
      });
  }

  loadSuppliers(): void {
    this.supplierService
      .getSuppliers(1, 100, { sortBy: 'name', sortDirection: 'asc' })
      .subscribe({
        next: (response) => {
          this.suppliers = response.data.content;
        },
        error: (error) => {
          this.toastService.error(
            'Error',
            'No se pudieron cargar los proveedores'
          );
        },
      });
  }

  loadCategories(): void {
    this.categoryItemService
      .getCategoryItemsByTipe(
        1,
        100,
        'name',
        'asc',
        CategoryType.INVENTORY_ITEM
      )
      .subscribe({
        next: (response) => {
          this.categories = response.data.content;
        },
        error: (error) => {
          this.toastService.error(
            'Error',
            'No se pudieron cargar las categorías'
          );
        },
      });
  }

  resetAndLoad(): void {
    this.page = 1;
    this.loadItems();
  }

  loadMore(): void {
    if (this.hasMore && !this.loading) {
      this.loadItems(true);
    }
  }

  initForm(): void {
    this.itemForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      unit: ['', [Validators.required]],
      unitCost: [0, [Validators.required, Validators.min(0)]],
      minStockLevel: [0, [Validators.required, Validators.min(0)]],
      supplierId: [null, [Validators.required]],
      categoryId: [null, [Validators.required]],
      location: ['', [Validators.required]],
      expiryDate: [''],
      isActive: [true],
    });
  }

  openCreateModal(): void {
    this.modalService
      .open(CreateItemComponent, {
        modal: {
          enter: 'enter-scaling 0.1s ease-out',
          leave: 'fade-out 0.1s ease-out',
          top: '50',
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
        data: { suppliers: this.suppliers, categories: this.categories },
      })
      .then((result) => {
        if (result) {
          this.resetAndLoad();
        }
      });
  }

  editItem(item: InventoryItem): void {
    this.modalService
      .open(EditItemComponent, {
        modal: {
          enter: 'enter-scaling 0.1s ease-out',
          leave: 'fade-out 0.1s ease-out',
          top: '50',
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

        data: { item, suppliers: this.suppliers, categories: this.categories },
      })
      .then((result) => {
        if (result) {
          this.resetAndLoad();
        }
      });
  }

  deleteItem(item: InventoryItem): void {
    this.alertService.warning(
      'Eliminar producto',
      '¿Estás seguro de eliminar este producto?',
      {
        buttons: [
          {
            text: 'Cancelar',
            type: 'danger',
            action: () => {
              this.alertService.close();
            },
          },
          {
            text: 'Eliminar',
            type: 'danger',
            action: () => {
              this.inventoryItemService.deleteInventoryItem(item.id).subscribe({
                next: (response) => {
                  this.toastService.success(response.message);
                  this.resetAndLoad();
                },
                error: (error) => {
                  this.toastService.error(error.message);
                  this.resetAndLoad();
                },
              });
            },
          },
        ],
      }
    );
  }

  saveItem(): void {
    if (this.itemForm.invalid) {
      this.toastService.error(
        'Error',
        'Formulario inválido. Por favor, revisa los campos.'
      );
      return;
    }

    const formValue = this.itemForm.value;

    if (this.isEditMode && this.currentItemId) {
      const updateRequest: UpdateInventoryItemRequest = {
        name: formValue.name,
        unit: formValue.unit,
        unitCost: formValue.unitCost,
        minStockLevel: formValue.minStockLevel,
        supplierId: formValue.supplierId,
        categoryId: formValue.categoryId,
        location: formValue.location,
        expiryDate: formValue.expiryDate,
        isActive: formValue.isActive,
      };

      this.inventoryItemService
        .updateInventoryItem(this.currentItemId, updateRequest)
        .subscribe({
          next: (response) => {
            this.toastService.success('Éxito', response.message);
            this.resetAndLoad();
          },
          error: (error) => {
            this.toastService.error('Error', error.message);
          },
        });
    } else {
      const createRequest: CreateInventoryItemRequest = {
        name: formValue.name,
        unit: formValue.unit,
        unitCost: formValue.unitCost,
        minStockLevel: formValue.minStockLevel,
        supplierId: formValue.supplierId,
        categoryId: formValue.categoryId,
        location: formValue.location,
        expiryDate: formValue.expiryDate,
        isActive: formValue.isActive,
      };

      this.inventoryItemService.createInventoryItem(createRequest).subscribe({
        next: (response) => {
          this.toastService.success('Éxito', response.message);
          this.resetAndLoad();
        },
        error: (error) => {
          this.toastService.error('Error', error.message);
        },
      });
    }
  }
}
