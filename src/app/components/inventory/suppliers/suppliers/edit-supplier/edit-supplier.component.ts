import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Supplier } from '@app/core/model/data/supplier';
import { UpdateSupplierRequest } from '@app/core/model/supplier/update-supplier-request';
import { SupplierService } from '@app/core/service/supplier.service';
import { ToastService } from '@app/lib/toast/toast.service';
import { LucideAngularModule } from 'lucide-angular';
import { ModalService } from 'ngx-modal-ease';

@Component({
  selector: 'app-edit-supplier',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './edit-supplier.component.html',
  styleUrl: './edit-supplier.component.css',
})
export class EditSupplierComponent implements OnInit {
  @Input() supplier!: Supplier;

  supplierForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private supplierService: SupplierService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.supplierForm = this.fb.group({
      name: [this.supplier.name, [Validators.required]],
      contactPerson: [this.supplier.contactPerson, [Validators.required]],
      phone: [this.supplier.phone, [Validators.required]],
      email: [this.supplier.email, [Validators.required, Validators.email]],
      address: [this.supplier.address, [Validators.required]],
      isActive: [this.supplier.isActive],
    });
  }

  closeModal(): void {
    this.modalService.close();
  }

  saveSupplier(): void {
    if (this.supplierForm.invalid) {
      this.supplierForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const supplierData: UpdateSupplierRequest = this.supplierForm.value;

    this.supplierService
      .updateSupplier(this.supplier.id, supplierData)
      .subscribe({
        next: () => {
          this.toastService.success('Proveedor actualizado correctamente');
          this.modalService.close(true);
        },
        error: (error) => {
          console.error('Error al actualizar el proveedor:', error);
          this.toastService.error('Error al actualizar el proveedor');
          this.loading = false;
        },
      });
  }
}
