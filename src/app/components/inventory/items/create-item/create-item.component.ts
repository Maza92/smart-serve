import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CategoryItem } from '@app/core/model/data/category-item';
import { Supplier } from '@app/core/model/data/supplier';
import { CreateInventoryItemRequest } from '@app/core/model/inventory-item/create-inventory-item';
import { InventoryItemService } from '@app/core/service/inventory-item.service';
import { ToastService } from '@app/lib/toast/toast.service';
import { LucideAngularModule } from 'lucide-angular';
import { ModalService } from 'ngx-modal-ease';

@Component({
  selector: 'app-create-item',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './create-item.component.html',
  styleUrl: './create-item.component.css',
})
export class CreateItemComponent implements OnInit {
  itemForm!: FormGroup;
  suppliers: Supplier[] = [];
  categories: CategoryItem[] = [];
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
      name: ['', [Validators.required]],
      unit: ['', [Validators.required]],
      unitCost: [0, [Validators.required, Validators.min(0)]],
      minStockLevel: [0, [Validators.required, Validators.min(0)]],
      supplierId: ['', [Validators.required]],
      categoryId: ['', [Validators.required]],
      location: ['', [Validators.required]],
      expiryDate: [null],
      isActive: [true],
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

    const itemData: CreateInventoryItemRequest = this.itemForm.value;
    if (itemData.expiryDate) {
      const [year, month, day] = itemData.expiryDate.split('-').map(Number);
      const utcDate = new Date(Date.UTC(year, month - 1, day));
      itemData.expiryDate = utcDate.toISOString();
    } else {
      return;
    }

    this.inventoryItemService.createInventoryItem(itemData).subscribe({
      next: () => {
        this.toastService.success('Item creado correctamente');
        this.modalService.close(true);
      },
      error: (error) => {
        console.error('Error al crear el item:', error);
        this.toastService.error('Error al crear el item');
        this.loading = false;
      },
    });
  }
}
