import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '@app/core/model/data/user';
import {
  ChipFilter,
  FilterOptions,
  RoleEnum,
  RoleLabels,
} from '@app/core/model/filter-options';
import { UserService } from '@app/core/service/user.service';
import { BackBarComponent } from '@app/shared/back-bar/back-bar.component';
import { LucideAngularModule } from 'lucide-angular';
import { ModalService } from 'ngx-modal-ease';
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  Subject,
  takeUntil,
} from 'rxjs';
import { FilterBottomSheetComponent } from './filter-bottom-sheet/filter-bottom-sheet/filter-bottom-sheet.component';
import { FormsModule } from '@angular/forms';
import { FilterChipComponent } from './filter-bottom-sheet/filter-chip/filter-chip.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    BackBarComponent,
    FormsModule,
    FilterChipComponent,
    RouterLink,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit, OnDestroy {
  data: User[] = [];
  page = 1;
  size = 10;
  hasMore = true;
  loading = false;
  error: string | null = null;

  filters: FilterOptions = {
    search: '',
    status: null,
    role: null,
    sortBy: 'username',
    sortDirection: 'asc',
  };
  activeFilters: ChipFilter[] = [];
  searchInput = '';
  searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.filters.search = value;
        this.resetAndLoad();
      });

    this.loadUsers();
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
        const filterResult = result.data as FilterOptions | null;
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

    if (this.filters.role) {
      this.activeFilters.push({
        type: 'role',
        value: this.filters.role,
        label: RoleLabels[this.filters.role as RoleEnum] || this.filters.role,
      });
    }

    if (
      this.filters.sortBy !== 'username' ||
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
      username: 'Usuario',
      firstName: 'Nombre',
      email: 'Correo',
      roleName: 'Rol',
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
      case 'role':
        this.filters.role = null;
        break;
      case 'sort':
        this.filters.sortBy = 'username';
        this.filters.sortDirection = 'asc';
        break;
    }

    this.updateActiveFilters();
    this.resetAndLoad();
  }

  loadUsers(loadMore: boolean = false): void {
    if (this.loading) return;

    if (loadMore) {
      this.page++;
    }

    this.loading = true;

    this.userService
      .getUsers(this.page, this.size, this.filters)
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
          this.error = null;
        },
        error: (error) => {
          this.error = error.message || 'Error al cargar usuarios';
          console.error('Error al cargar usuarios:', error);
        },
      });
  }

  resetAndLoad(): void {
    this.page = 1;
    this.loadUsers();
  }

  loadMore(): void {
    if (this.hasMore && !this.loading) {
      this.loadUsers(true);
    }
  }
}
