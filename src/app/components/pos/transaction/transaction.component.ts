import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { TransactionsService } from '@app/core/service/transactions.service';
import { PaymentMethodEnum } from '@app/core/enums/transaction-enums';
import { CreateOrderTransactionRequest } from '@app/core/model/transaction/create-order-transaction-request';
import { BackBarComponent } from '@app/shared/back-bar/back-bar.component';
import { ToastService } from '@app/lib/toast/toast.service';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    BackBarComponent,
  ],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css',
})
export class TransactionComponent implements OnInit {
  transactionForm!: FormGroup;
  orderId: number | null = null;
  paymentMethods = Object.values(PaymentMethodEnum);
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private transactionsService: TransactionsService,
    private toastService: ToastService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.orderId) {
      this.toastService.error('ID de orden no válido');
      this.router.navigate(['/pos/orders']);
    }
  }

  createForm(): void {
    this.transactionForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      paymentMethod: [PaymentMethodEnum.CASH, Validators.required],
      referenceNumber: [''],
      paymentDetails: this.fb.group({
        cardNumber: [''],
        cardHolder: [''],
        expiryDate: [''],
        cvv: [''],
      }),
    });
  }

  onSubmit(): void {
    if (this.transactionForm.invalid || this.isSubmitting) {
      return;
    }

    if (this.orderId === null) {
      this.toastService.error('ID de orden no válido');
      return;
    }

    this.isSubmitting = true;

    const formValue = this.transactionForm.value;
    const request: CreateOrderTransactionRequest = {
      orderId: this.orderId,
      amount: formValue.amount,
      paymentMethod: formValue.paymentMethod,
      referenceNumber: formValue.referenceNumber,
      paymentDetails: formValue.paymentDetails,
    };

    this.transactionsService.createOrderTransaction(request).subscribe({
      next: (response) => {
        this.toastService.success('Transacción completada con éxito');
        this.router.navigate(['/pos/orders']);
      },
      error: (error) => {
        this.toastService.error('Error al procesar la transacción');
        this.isSubmitting = false;
      },
    });
  }

  get showReferenceField(): boolean {
    const method = this.transactionForm.get('paymentMethod')?.value;
    return (
      method === PaymentMethodEnum.BANK_TRANSFER ||
      method === PaymentMethodEnum.YAPE ||
      method === PaymentMethodEnum.PLIN ||
      method === PaymentMethodEnum.ONLINE_PAYMENT
    );
  }

  getPaymentMethodLabel(type: PaymentMethodEnum): string {
    const labels: Record<PaymentMethodEnum, string> = {
      [PaymentMethodEnum.CASH]: 'Efectivo',
      [PaymentMethodEnum.CREDIT_CARD]: 'Tarjeta de crédito',
      [PaymentMethodEnum.DEBIT_CARD]: 'Tarjeta de débito',
      [PaymentMethodEnum.BANK_TRANSFER]: 'Transferencia bancaria',
      [PaymentMethodEnum.YAPE]: 'Yape',
      [PaymentMethodEnum.PLIN]: 'Plin',
      [PaymentMethodEnum.ONLINE_PAYMENT]: 'Pago en línea',
      [PaymentMethodEnum.COURTESY]: 'Cobro de cortesía',
    };
    return labels[type] || type;
  }

  get showCardFields(): boolean {
    const method = this.transactionForm.get('paymentMethod')?.value;
    return (
      method === PaymentMethodEnum.CREDIT_CARD ||
      method === PaymentMethodEnum.DEBIT_CARD
    );
  }
}
