import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OpenCashRegisterRequest } from '@app/core/model/cash/open-cash-register-request';
import { CashRegister } from '@app/core/model/data/cash-register';
import { CashRegisterService } from '@app/core/service/cash-register.service';
import { ToastService } from '@app/lib/toast/toast.service';
import { LucideAngularModule } from 'lucide-angular';
import { ModalService } from 'ngx-modal-ease';

@Component({
  selector: 'app-open-cash-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
    CommonModule,
  ],
  templateUrl: './open-cash-register.component.html',
  styleUrl: './open-cash-register.component.css',
})
export class OpenCashRegisterComponent implements OnInit {
  openCashRegisterForm!: FormGroup;
  cashRegisters: CashRegister[] = [];

  constructor(
    private builder: FormBuilder,
    private cashRegisterService: CashRegisterService,
    private modalService: ModalService,
    private toastService: ToastService
  ) {
    this.openCashRegisterForm = this.builder.group({
      cashRegisterId: ['', Validators.required],
      initialAmount: ['', Validators.required],
      notes: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAvailablesCashRegistersToOpen();
  }

  openCashRegister() {
    if (this.openCashRegisterForm.invalid) {
      this.toastService.error('Formulario invalido', 'Error');
      return;
    }

    const formValue = this.openCashRegisterForm.value;
    const cashRegisterId = formValue.cashRegisterId;

    const request: OpenCashRegisterRequest = {
      initialAmount: formValue.initialAmount,
      notes: formValue.notes,
    };

    this.cashRegisterService
      .openCashRegister(request, cashRegisterId)
      .subscribe(
        (response) => {
          this.toastService.success(response.message, 'Exito');
          this.modalService.close(true);
        },
        (error) => {
          this.toastService.error(error.message, 'Error');
        }
      );
  }
  closeModal() {
    this.modalService.close();
  }

  getAvailablesCashRegistersToOpen() {
    this.cashRegisterService.getAvailablesCashRegistersToOpen().subscribe(
      (response) => {
        this.cashRegisters = response.data;
      },
      (error) => {
        this.toastService.error(error.message, 'Error');
      }
    );
  }
}
