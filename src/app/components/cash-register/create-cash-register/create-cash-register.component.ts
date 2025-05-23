import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CreateCashRegisterRequest } from '@app/core/model/cash/create-cash-register-request';
import { CashRegisterService } from '@app/core/service/cash-register.service';
import { ToastService } from '@app/lib/toast/toast.service';
import { BackBarComponent } from '@app/shared/back-bar/back-bar.component';
import { LucideAngularModule } from 'lucide-angular';
import { ModalService } from 'ngx-modal-ease';

@Component({
  selector: 'app-create-cash-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
    CommonModule,
  ],
  templateUrl: './create-cash-register.component.html',
  styleUrl: './create-cash-register.component.css',
})
export class CreateCashRegisterComponent {
  cashRegisterform!: FormGroup;

  constructor(
    private builder: FormBuilder,
    private modalService: ModalService,
    private cashRegisterService: CashRegisterService,
    private toastService: ToastService
  ) {
    this.cashRegisterform = this.builder.group({
      notes: [
        '',
        [Validators.required, Validators.min(1), Validators.max(1000)],
      ],
    });
  }

  get notes() {
    return this.cashRegisterform.get('notes');
  }

  closeModal() {
    this.modalService.close();
  }

  createCashRegister() {
    if (this.cashRegisterform.invalid) {
      this.toastService.error('Formulario invalido', 'Error');
      return;
    }

    const data: CreateCashRegisterRequest = {
      notes: this.notes?.value,
    };

    this.cashRegisterService.createCashRegister(data).subscribe(
      (response) => {
        this.toastService.success(response.message, 'Exito');
        this.cashRegisterform.reset();
        this.modalService.close(true);
      },
      (error) => {
        this.toastService.error(error.message, 'Error');
      }
    );
  }
}
