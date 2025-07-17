import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InventoryItem } from '@app/core/model/data/inventory-item';
import { InventoryItemService } from '@app/core/service/inventory-item.service';
import { ToastService } from '@app/lib/toast/toast.service';
import { LucideAngularModule } from 'lucide-angular';
import { ModalService } from 'ngx-modal-ease';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-item-select-multiple',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="bg-white rounded-3xl p-4">
      <h1 class="text-xl font-medium">Selecciona productos</h1>

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
              placeholder="Buscar productos..."
              class="form-input py-2 w-full"
            />
          </div>
          <button
            type="button"
            class="bg-background text-on-background w-16 flex justify-center items-center active:opacity-70 rounded-full p-2 focus:outline-2 focus:outline-offset-2 focus:outline-background"
            (click)="clearSearch()"
          >
            <i-lucide name="eraser" class="w-4 h-4"></i-lucide>
          </button>
        </div>

        <div class="max-h-60 overflow-y-auto">
          <div
            *ngIf="items.length === 0"
            class="text-center py-4 text-gray-500"
          >
            No se encontraron productos
          </div>
          <div *ngFor="let item of items" class="form-check mb-2">
            <input
              type="checkbox"
              [id]="'item-' + item.id"
              class="form-checkbox"
              [checked]="isItemSelected(item)"
              (change)="toggleItemSelection(item)"
            />
            <label
              [for]="'item-' + item.id"
              class="form-label cursor-pointer flex-1"
            >
              {{ item.name }} ({{ item.unitId || item.unitId }})
            </label>
          </div>
        </div>

        <div class="flex justify-between mt-4">
          <button
            type="button"
            class="button button-outline"
            (click)="cancel()"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="button button-primary"
            [disabled]="selectedItems.length === 0"
            (click)="saveItems()"
          >
            Seleccionar ({{ selectedItems.length }})
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [``],
})
export class ItemSelectMultipleComponent implements OnInit {
  items: InventoryItem[] = [];
  selectedItems: InventoryItem[] = [];
  searchSubject = new Subject<string>();
  searchInput = '';
  page = 1;
  pageSize = 50;
  @Input() supplierId = 0;

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
        this.resetAndLoad();
      });
  }

  resetAndLoad() {
    this.page = 1;
    this.loadItems();
  }

  clearSearch() {
    this.searchInput = '';
    this.resetAndLoad();
  }

  loadItems() {
    if (!this.supplierId) return;

    this.inventoryItemService
      .getInventoryItemsBySupplierId(this.supplierId, this.page, this.pageSize)
      .subscribe(
        (res) => {
          this.items = res.data.content;
          if (this.items.length <= 0) {
            this.toastService.warning(
              'No se encontraron productos para este proveedor'
            );
          }
        },
        (error) => {
          this.toastService.error(
            'Error al cargar productos',
            error.error?.message || 'Error desconocido'
          );
        }
      );
  }

  onSearchChange(searchTerm: string) {
    this.searchSubject.next(searchTerm);
  }

  isItemSelected(item: InventoryItem): boolean {
    return this.selectedItems.some(
      (selectedItem) => selectedItem.id === item.id
    );
  }

  toggleItemSelection(item: InventoryItem) {
    if (this.isItemSelected(item)) {
      this.selectedItems = this.selectedItems.filter(
        (selectedItem) => selectedItem.id !== item.id
      );
    } else {
      this.selectedItems.push(item);
    }
  }

  saveItems() {
    if (this.selectedItems.length === 0) return;
    this.modalService.close(this.selectedItems);
  }

  cancel() {
    this.modalService.close(null);
  }
}
