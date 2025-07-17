import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CashMovementTypeEnum } from '@app/core/enums/cash-movement-enums';
import { CashMovement } from '@app/core/model/data/cash-movement';
import {
  CashMovementFilterOptions,
  ChipFilter,
} from '@app/core/model/filter-options';
import { CashMovementService } from '@app/core/service/cash-movement.service';
import { NavigationService } from '@app/core/service/navigation.service';
import { ToastService } from '@app/lib/toast/toast.service';
import { BackBarComponent } from '@app/shared/back-bar/back-bar.component';
import { LucideAngularModule } from 'lucide-angular';
import { ModalService } from 'ngx-modal-ease';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  finalize,
  takeUntil,
} from 'rxjs';
import { CashMovementDetailComponent } from './cash-movement-detail/cash-movement-detail.component';
import { FilterBottomSheetComponent } from './filter-bottom-sheet/filter-bottom-sheet.component';
import { FilterChipComponent } from './filter-bottom-sheet/filter-chip/filter-chip.component';

@Component({
  selector: 'app-cash-movements',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    BackBarComponent,
    FormsModule,
    FilterChipComponent,
  ],
  templateUrl: './cash-movements.component.html',
  styleUrl: './cash-movements.component.css',
})
export class CashMovementsComponent implements OnInit, OnDestroy {
  movements: CashMovement[] = [];
  page = 1;
  pageSize = 10;
  hasMore = true;
  loading = false;
  totalMovements = 0;

  filters: CashMovementFilterOptions = {
    startDate: undefined,
    endDate: undefined,
    movementType: undefined,
    sortBy: 'movementDate',
    sortDirection: 'desc',
  };

  activeFilters: ChipFilter[] = [];
  searchInput = '';
  searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private cashMovementService: CashMovementService,
    private toastService: ToastService,
    private modalService: ModalService,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.resetAndLoad();
      });

    this.loadMovements();
    this.navigationService.configureNavbar(['home', 'settings']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  filterByType(type: CashMovementTypeEnum | undefined): void {
    if (this.filters.movementType === type) {
      this.filters.movementType = undefined;
    } else {
      this.filters.movementType = type;
    }
    this.updateActiveFilters();
    this.resetAndLoad();
  }

  get CashMovementTypeEnum(): typeof CashMovementTypeEnum {
    return CashMovementTypeEnum;
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
        const filterResult = result.data as CashMovementFilterOptions | null;
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

    if (this.filters.movementType) {
      this.activeFilters.push({
        type: 'movementType',
        value: this.filters.movementType,
        label: this.getMovementTypeLabel(this.filters.movementType),
      });
    }

    if (this.filters.startDate) {
      this.activeFilters.push({
        type: 'date',
        value: 'startDate',
        label: `Desde: ${this.formatDate(this.filters.startDate)}`,
      });
    }

    if (this.filters.endDate) {
      this.activeFilters.push({
        type: 'date',
        value: 'endDate',
        label: `Hasta: ${this.formatDate(this.filters.endDate)}`,
      });
    }

    if (
      this.filters.sortBy !== 'movementDate' ||
      this.filters.sortDirection !== 'desc'
    ) {
      const sortLabel = this.getSortLabel();
      this.activeFilters.push({
        type: 'sort',
        value: `${this.filters.sortBy}_${this.filters.sortDirection}`,
        label: sortLabel,
      });
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  getSortLabel(): string {
    const fieldMap: Record<string, string> = {
      movementDate: 'Fecha',
      amount: 'Monto',
      username: 'Usuario',
    };

    const directionMap: Record<string, string> = {
      asc: '↑',
      desc: '↓',
    };

    return `${
      fieldMap[this.filters.sortBy as keyof typeof fieldMap] ||
      this.filters.sortBy
    } ${
      directionMap[this.filters.sortDirection as keyof typeof directionMap] ||
      ''
    }`;
  }

  removeFilter(filter: ChipFilter): void {
    switch (filter.type) {
      case 'movementType':
        this.filters.movementType = undefined;
        break;
      case 'date':
        if (filter.value === 'startDate') {
          this.filters.startDate = undefined;
        } else if (filter.value === 'endDate') {
          this.filters.endDate = undefined;
        }
        break;
      case 'sort':
        this.filters.sortBy = 'movementDate';
        this.filters.sortDirection = 'desc';
        break;
    }

    this.updateActiveFilters();
    this.resetAndLoad();
  }

  resetAndLoad(): void {
    this.page = 1;
    this.loadMovements();
  }

  loadMovements(loadMore: boolean = false): void {
    if (this.loading) return;

    if (loadMore) {
      this.page++;
    }

    this.loading = true;

    this.cashMovementService
      .getCashMovements(this.page, this.pageSize, this.filters)
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

  loadMore(): void {
    if (this.hasMore && !this.loading) {
      this.loadMovements(true);
    }
  }

  openMovementDetailModal(movement: CashMovement): void {
    this.modalService.open(CashMovementDetailComponent, {
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
        height: '90%',
        padding: '1rem',
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
}
