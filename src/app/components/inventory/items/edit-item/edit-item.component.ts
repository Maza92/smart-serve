import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CategoryItem } from '@app/core/model/data/category-item';
import { InventoryItem } from '@app/core/model/data/inventory-item';
import { Supplier } from '@app/core/model/data/supplier';
import { UpdateInventoryItemRequest } from '@app/core/model/inventory-item/update-inventory-item';
import { InventoryItemService } from '@app/core/service/inventory-item.service';
import { ToastService } from '@app/lib/toast/toast.service';
import { LucideAngularModule } from 'lucide-angular';
import { ModalService } from 'ngx-modal-ease';

@Component({
  selector: 'app-edit-item',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './edit-item.component.html',
  styleUrl: './edit-item.component.css',
})
export class EditItemComponent implements OnInit {
  @Input() item!: InventoryItem;
  @Input() suppliers: Supplier[] = [];
  @Input() categories: CategoryItem[] = [];

  itemForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private inventoryItemService: InventoryItemService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.itemForm = this.fb.group({
      name: [this.item.name, [Validators.required]],
      imagePath: [this.item.imagePath, [Validators.required]],
      unit: [this.item.unit, [Validators.required]],
      unitCost: [this.item.unitCost, [Validators.required, Validators.min(0)]],
      minStockLevel: [
        this.item.minStockLevel,
        [Validators.required, Validators.min(0)],
      ],
      supplierId: [this.item.supplierId, [Validators.required]],
      categoryId: [this.item.categoryId, [Validators.required]],
      location: [this.item.location, [Validators.required]],
      expiryDate: [
        this.item.expiryDate
          ? new Date(this.item.expiryDate).toISOString().split('T')[0]
          : null,
      ],
      isActive: [this.item.isActive],
    });
  }

  closeModal(): void {
    this.modalService.close();
  }

  saveItem(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const itemData: UpdateInventoryItemRequest = this.itemForm.value;
    if (itemData.expiryDate) {
      const [year, month, day] = itemData.expiryDate.split('-').map(Number);
      const utcDate = new Date(Date.UTC(year, month - 1, day));
      itemData.expiryDate = utcDate.toISOString();
    } else {
      return;
    }

    this.inventoryItemService
      .updateInventoryItem(this.item.id, itemData)
      .subscribe({
        next: () => {
          this.toastService.success('Item actualizado correctamente');
          this.modalService.close(true);
        },
        error: (error) => {
          console.error('Error al actualizar el item:', error);
          this.toastService.error('Error al actualizar el item');
          this.loading = false;
        },
      });
  }
}
