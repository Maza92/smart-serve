import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Supplier } from '@app/core/model/data/supplier';
import {
  BaseRequiredSortFilterOptions,
  BaseSearchFilterOptions,
  ChipFilter,
} from '@app/core/model/filter-options';
import { SupplierService } from '@app/core/service/supplier.service';
import { ToastService } from '@app/lib/toast/toast.service';
import { LucideAngularModule } from 'lucide-angular';
import { ModalService } from 'ngx-modal-ease';
import {
  Subject,
  takeUntil,
  debounceTime,
  distinctUntilChanged,
  finalize,
} from 'rxjs';
import { FilterBottomSheetComponent } from './filter-bottom-sheet/filter-bottom-sheet/filter-bottom-sheet.component';
import { FilterChipComponent } from './filter-bottom-sheet/filter-chip/filter-chip.component';
import { CreateSupplierComponent } from './create-supplier/create-supplier.component';
import { RouterLink } from '@angular/router';
import { BackBarComponent } from '@app/shared/back-bar/back-bar.component';
import { BasePageComponent } from '@app/shared/base-page/base-page.component';
import { NavigationService } from '@app/core/service/navigation.service';
import { GoToDirective } from '@app/shared/directives/go-to.directive';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    BackBarComponent,
    FormsModule,
    FilterChipComponent,
    RouterLink,
    BasePageComponent,
    GoToDirective,
  ],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.css',
})
export class SuppliersComponent implements OnInit, OnDestroy {
  data: Supplier[] = [];
  page = 1;
  size = 10;
  hasMore = true;
  loading = false;

  path: string | null = null;

  filters: BaseRequiredSortFilterOptions = {
    search: '',
    status: null,
    sortBy: 'name',
    sortDirection: 'asc',
  };
  activeFilters: ChipFilter[] = [];
  searchInput = '';
  searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private supplierService: SupplierService,
    private modalService: ModalService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.filters.search = value;
        this.resetAndLoad();
      });

    this.loadSuppliers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
        data: {
          currentFilters: this.filters,
        },
      })
      .then((result) => {
        const filterResult =
          result.data as BaseRequiredSortFilterOptions | null;
        if (filterResult) {
          this.filters = filterResult;
          this.updateActiveFilters();
          this.resetAndLoad();
        }
      })
      .catch((error) => {
        console.error('Error en modal de filtros:', error);
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
      contactPerson: 'Contacto',
      email: 'Correo',
      phone: 'Teléfono',
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
        this.filters.status = null;
        break;
      case 'sort':
        this.filters.sortBy = 'name';
        this.filters.sortDirection = 'asc';
        break;
    }

    this.updateActiveFilters();
    this.resetAndLoad();
  }

  loadSuppliers(loadMore: boolean = false): void {
    if (this.loading) return;

    if (loadMore) {
      this.page++;
    }

    this.loading = true;

    this.supplierService
      .getSuppliers(this.page, this.size, this.filters)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          const newData = response.data.content;

          if (loadMore) {
            this.data = [...this.data, ...newData];
          } else {
            this.data = newData;
          }

          this.hasMore = newData.length === this.size;
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

  resetAndLoad(): void {
    this.page = 1;
    this.loadSuppliers();
  }

  loadMore(): void {
    if (this.hasMore && !this.loading) {
      this.loadSuppliers(true);
    }
  }

  openCreateModal(): void {
    this.modalService
      .open(CreateSupplierComponent, {
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
          maxWidth: '500px',
        },
        actions: {
          escape: true,
          click: true,
        },
      })
      .then((result) => {
        if (result.data) {
          this.toastService.success('Éxito', 'Proveedor creado correctamente', {
            position: 'top-center',
            showCloseButton: false,
            showProgressBar: false,
            duration: 3000,
          });
          this.resetAndLoad();
        }
      })
      .catch((error) => {
        console.error('Error en modal de creación:', error);
      });
  }
}
