import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CloseCashRegisterRequest } from '@app/core/model/cash/close-cash-register-request';
import { CashRegister } from '@app/core/model/data/cash-register';
import { CashRegisterService } from '@app/core/service/cash-register.service';
import { ToastService } from '@app/lib/toast/toast.service';
import { LucideAngularModule } from 'lucide-angular';
import { ModalService } from 'ngx-modal-ease';

@Component({
  selector: 'app-close-cash-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
    CommonModule,
  ],
  templateUrl: './close-cash-register.component.html',
  styleUrl: './close-cash-register.component.css',
})
export class CloseCashRegisterComponent implements OnInit {
  closeCashRegisterForm!: FormGroup;
  cashRegisters: CashRegister[] = [];

  constructor(
    private builder: FormBuilder,
    private toastService: ToastService,
    private cashRegisterService: CashRegisterService,
    private modalService: ModalService
  ) {
    this.closeCashRegisterForm = this.builder.group({
      cashRegisterId: ['', Validators.required],
      finalAmount: ['', Validators.required],
      notes: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getCurrentOpenedCashRegister();
  }

  closeCashRegister() {
    if (this.closeCashRegisterForm.invalid) {
      this.toastService.error('Form is invalid', 'Error');
      return;
    }

    const request: CloseCashRegisterRequest = {
      finalAmount: this.finalAmount?.value,
      notes: this.notes?.value,
    };

    this.cashRegisterService
      .closeCashRegister(request, this.cashRegisterId?.value)
      .subscribe(
        (response) => {
          this.toastService.success(response.message, 'Success');
          this.closeCashRegisterForm.reset();
          this.modalService.close(true);
        },
        (error) => {
          this.toastService.error(error.message, 'Error');
        }
      );
  }

  get cashRegisterId() {
    return this.closeCashRegisterForm.get('cashRegisterId');
  }

  get finalAmount() {
    return this.closeCashRegisterForm.get('finalAmount');
  }

  get notes() {
    return this.closeCashRegisterForm.get('notes');
  }

  getCurrentOpenedCashRegister() {
    this.cashRegisterService.getCurrentOpenedCashRegister().subscribe(
      (response) => {
        this.cashRegisters.push(response.data);
      },
      (error) => {
        this.toastService.error(error.message, 'Error');
      }
    );
  }

  closeModal() {
    this.modalService.close();
  }
}
