import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CreateSupplierRequest } from '@app/core/model/supplier/create-supplier-request';
import { SupplierService } from '@app/core/service/supplier.service';
import { ToastService } from '@app/lib/toast/toast.service';
import { BasePageComponent } from '@app/shared/base-page/base-page.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-create-supplier',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    BasePageComponent,
  ],
  templateUrl: './create-supplier.component.html',
  styleUrl: './create-supplier.component.css',
})
export class CreateSupplierComponent implements OnInit {
  supplierForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.supplierForm = this.fb.group({
      name: ['', [Validators.required]],
      contactPerson: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      isActive: [true],
    });
  }

  saveSupplier(): void {
    if (this.supplierForm.invalid) {
      this.supplierForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const supplierData: CreateSupplierRequest = this.supplierForm.value;

    this.supplierService.createSupplier(supplierData).subscribe({
      next: () => {
        this.toastService.success('Proveedor creado correctamente');
        this.onCancel();
      },
      error: (error) => {
        console.error('Error al crear el proveedor:', error);
        this.toastService.error('Error al crear el proveedor');
        this.loading = false;
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/home/inventory/suppliers']);
  }
}
