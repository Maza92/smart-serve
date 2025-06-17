import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InventoryItem } from '@app/core/model/data/inventory-item';
import { BaseFilterOptions } from '@app/core/model/filter-options';
import { InventoryItemService } from '@app/core/service/inventory-item.service';
import { ToastService } from '@app/lib/toast/toast.service';
import { LucideAngularModule } from 'lucide-angular';
import { ModalService } from 'ngx-modal-ease';
import { debounce, debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-item-select',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './item-select.component.html',
  styleUrl: './item-select.component.css',
})
export class ItemSelectComponent implements OnInit {
  items: InventoryItem[] = [];
  selectedItem!: InventoryItem;
  searchSubject = new Subject<string>();
  searchInput = '';
  page = 1;
  pageSize = 10;

  filters: BaseFilterOptions = {
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
