import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InventoryItem } from '@app/core/model/data/inventory-item';
import {
  BaseRequiredSortFilterOptions,
  BaseSearchFilterOptions,
} from '@app/core/model/filter-options';
import { InventoryItemService } from '@app/core/service/inventory-item.service';
import { ToastService } from '@app/lib/toast/toast.service';
import { LucideAngularModule } from 'lucide-angular';
import { ModalService } from 'ngx-modal-ease';
import { debounce, debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-item-select',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="bg-white rounded-3xl p-4">
      <h1 class="text-xl font-medium">Selecciona un ingrediente</h1>

      <form class="flex flex-col gap-4 py-4">
        <div class="flex gap-2">
          <div class="form-group-icon">
            <i-lucide
              name="search"
              class="icon text-gray-400"
              size="25"
            ></i-lucide>
            <input
              type="text"
              [(ngModel)]="searchInput"
              (ngModelChange)="onSearchChange($event)"
              [ngModelOptions]="{ standalone: true }"
              placeholder="Buscar proveedores..."
              class="form-input py-2 w-full"
            />
          </div>
          <button
            class="bg-background text-on-background w-16 flex justify-center items-center active:opacity-70 rounded-full p-2 focus:outline-2 focus:outline-offset-2 focus:outline-background"
            (click)="clearSearch()"
          >
            <i-lucide name="eraser" class="w-4 h-4"></i-lucide>
          </button>
        </div>
        <div class="form-group bg-on-surface border-on-surface">
          <label for="item" class="form-label">item</label>
          <select
            name="item"
            id="item"
            class="form-select"
            [(ngModel)]="selectedItem"
          >
            <option value="" disabled selected>
              Selecciona un ingrediente
            </option>
            <option *ngFor="let item of items" [ngValue]="item">
              {{ item.name }}
            </option>
          </select>

          <lucide-icon class="icon" size="30" name="chevron-down"></lucide-icon>
        </div>
        <button
          class="button button-primary button-lg w-full"
          [disabled]="!selectedItem"
          (click)="saveItem()"
        >
          Seleccionar
        </button>
      </form>
    </div>
  `,
})
export class ItemSelectComponent implements OnInit {
  items: InventoryItem[] = [];
  @Output() selectedItem!: InventoryItem;
  searchSubject = new Subject<string>();
  searchInput = '';
  page = 1;
  pageSize = 10;

  filters: BaseRequiredSortFilterOptions = {
    search: '',
    sortBy: 'name',
    sortDirection: 'asc',
  };

  constructor(
    private inventoryItemService: InventoryItemService,
    private modalService: ModalService,
    private toastService: ToastService
  ) {}
  ngOnInit(): void {
    this.loadItems();

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.filters.search = searchTerm;
        this.resetAndLoad();
      });
  }

  resetAndLoad() {
    this.page = 1;
    this.loadItems();
  }

  clearSearch() {
    this.searchInput = '';
    this.filters.search = '';
    this.resetAndLoad();
  }

  loadItems() {
    this.inventoryItemService
      .getInventoryItems(this.page, this.pageSize, this.filters)
      .subscribe(
        (res) => {
          this.items = res.data.content;
          if (this.items.length <= 0) {
            this.toastService.warning('Resultados no encontrados');
            return;
          }
          this.toastService.success(res.message);
        },
        (error) => {
          this.toastService.error('Failed to load items', error.error.message);
        }
      );
  }

  onSearchChange(searchTerm: string) {
    this.searchSubject.next(searchTerm);
  }

  saveItem() {
    if (!this.selectedItem) return;

    this.modalService.close(this.selectedItem);
  }
}
