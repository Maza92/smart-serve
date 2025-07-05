import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { CashMovementService } from '@app/core/service/cash-movement.service';
import { CreateCashMovementRequest } from '@app/core/model/cash-movement/create-cash-movement-request';
import { CashMovementTypeEnum } from '@app/core/enums/cash-movement-enums';
import { ModalService } from 'ngx-modal-ease';
import { ToastService } from '@app/lib/toast/toast.service';

@Component({
  selector: 'app-create-movement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './create-movement.component.html',
  styleUrl: './create-movement.component.css',
})
export class CreateMovementComponent implements OnInit {
  @Input() cashRegisterId!: number;

  createMovementForm!: FormGroup;
  movementTypes = Object.values(CashMovementTypeEnum);
  MovementTypeLabels: Record<CashMovementTypeEnum, string> = {
    [CashMovementTypeEnum.INCOME]: 'Ingreso',
    [CashMovementTypeEnum.EXPENSE]: 'Egreso',
    [CashMovementTypeEnum.ADJUSTMENT_INCOME]: 'Ajuste de Ingreso',
    [CashMovementTypeEnum.ADJUSTMENT_EXPENSE]: 'Ajuste de Egreso',
    [CashMovementTypeEnum.SALE]: 'Venta',
    [CashMovementTypeEnum.REFUND]: 'Reembolso',
  };

  constructor(
    private fb: FormBuilder,
    private cashMovementService: CashMovementService,
    private modalService: ModalService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.createMovementForm = this.fb.group({
      amount: [0, [Validators.required, Validators.min(0.01)]],
      movementType: [CashMovementTypeEnum.INCOME, Validators.required],
      reason: [''],
      authorizedBy: [''],
    });
  }

  createMovement(): void {
    if (this.createMovementForm.invalid) {
      this.toastService.error('Por favor completa todos los campos requeridos');
      return;
    }

    const request: CreateCashMovementRequest = {
      cashRegisterId: this.cashRegisterId,
      amount: this.amount?.value,
      movementType: this.movementType?.value,
      reason: this.reason?.value,
      authorizedBy: this.authorizedBy?.value,
    };

    console.log(request);
    this.cashMovementService.createCashMovement(request).subscribe({
      next: (response) => {
        this.toastService.show({
          message: 'Movimiento creado exitosamente',
          type: 'success',
          duration: 3000,
        });
        this.closeModal();
      },
      error: (error) => {
        this.toastService.show({
          message:
            'Error al crear el movimiento: ' +
            (error.error?.message || 'Error desconocido'),
          type: 'error',
          duration: 5000,
        });
      },
    });
  }

  get amount() {
    return this.createMovementForm.get('amount');
  }

  get movementType() {
    return this.createMovementForm.get('movementType');
  }

  get reason() {
    return this.createMovementForm.get('reason');
  }

  get authorizedBy() {
    return this.createMovementForm.get('authorizedBy');
  }

  closeModal(): void {
    this.modalService.close();
  }
}
