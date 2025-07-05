import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Order } from '@app/core/model/data/order';
import { OrderStatusEnum } from '@app/core/enums/order-enum';
import { OrderService } from '@app/core/service/order.service';
import { ToastService } from '@app/lib/toast/toast.service';
import { ModalService } from 'ngx-modal-ease';
import { GoToDirective } from '@app/shared/directives/go-to.directive';
import { NavigationService } from '@app/core/service/navigation.service';
import { BasePageComponent } from '@app/shared/base-page/base-page.component';

@Component({
  selector: 'app-table-order-detail',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './table-order-detail.component.html',
  styleUrl: './table-order-detail.component.css',
})
export class TableOrderDetailComponent implements OnInit {
  @Input() tableId!: number;
  order: Order | null = null;
  OrderStatusEnum = OrderStatusEnum;

  constructor(
    private orderService: OrderService,
    private toastService: ToastService,
    private modalService: ModalService,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    this.loadOrder();
  }

  loadOrder(): void {
    this.orderService.getOrderByTableId(this.tableId).subscribe({
      next: (response) => {
        this.order = response.data;
      },
      error: (error) => {
        this.toastService.error(error.message);
      },
    });
  }

  getOrderStatusClass(): { background: string; color: string } {
    if (!this.order) return { background: '', color: '' };

    switch (this.order.status) {
      case OrderStatusEnum.PENDING:
        return { background: 'bg-outline-variant', color: 'text-outline' };
      case OrderStatusEnum.SENT_TO_KITCHEN:
        return { background: 'bg-secondary-key', color: 'text-secondary' };
      case OrderStatusEnum.IN_PREPARATION:
        return { background: 'bg-secondary', color: 'text-on-secondary' };
      case OrderStatusEnum.READY:
        return { background: 'bg-primary', color: 'text-on-primary' };
      case OrderStatusEnum.SERVED:
        return { background: 'bg-tertiary', color: 'text-on-tertiary' };
      case OrderStatusEnum.PAYMENT_PENDING:
        return { background: 'bg-primary-key', color: 'text-white' };
      case OrderStatusEnum.PAID:
        return {
          background: 'bg-tertiary-container',
          color: 'text-on-tertiary-container',
        };
      case OrderStatusEnum.CANCELLED:
        return { background: 'bg-error', color: 'text-on-error' };
      case OrderStatusEnum.RETURNED:
        return {
          background: 'bg-error-container',
          color: 'text-on-error-container',
        };
      case OrderStatusEnum.PARTIAL_SERVED:
        return {
          background: 'bg-primary-container',
          color: 'text-on-primary-container',
        };
      default:
        return { background: '', color: '' };
    }
  }

  getStatusText(): string {
    if (!this.order) return '';

    switch (this.order.status) {
      case OrderStatusEnum.PENDING:
        return 'Pendiente';
      case OrderStatusEnum.SENT_TO_KITCHEN:
        return 'Enviado a cocina';
      case OrderStatusEnum.IN_PREPARATION:
        return 'En preparación';
      case OrderStatusEnum.READY:
        return 'Listo';
      case OrderStatusEnum.SERVED:
        return 'Servido';
      case OrderStatusEnum.PAYMENT_PENDING:
        return 'Cuenta solicitada';
      case OrderStatusEnum.PAID:
        return 'Pagado';
      default:
        return this.order.status;
    }
  }

  getStatusColor(): string {
    if (!this.order) return '';

    switch (this.order.status) {
      case OrderStatusEnum.SENT_TO_KITCHEN:
        return 'text-blue-600';
      case OrderStatusEnum.IN_PREPARATION:
        return 'text-primary-key';
      case OrderStatusEnum.READY:
        return 'text-green-600';
      case OrderStatusEnum.SERVED:
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  }

  isServedButtonEnabled(): boolean {
    return this.order?.status === OrderStatusEnum.READY;
  }

  isAccountButtonsEnabled(): boolean {
    return (
      this.order?.status === OrderStatusEnum.SERVED ||
      this.order?.status === OrderStatusEnum.PAID ||
      this.order?.status === OrderStatusEnum.PAYMENT_PENDING
    );
  }

  isNeedCleaningButtonEnable(): boolean {
    return this.order?.status === OrderStatusEnum.PAID;
  }

  onMarkServed(): void {
    if (this.order) {
      this.orderService.markOrderServed(this.order.id).subscribe({
        next: () => {
          this.closeModal();
        },
        error: (error) => {
          this.toastService.error(error.message);
        },
      });
    }
  }

  onMarkCleaned(): void {
    if (this.order) {
      this.orderService.markOrderIsFinalized(this.order.id).subscribe({
        next: () => {
          this.closeModal();
        },
        error: (error) => {
          this.toastService.error(error.message);
        },
      });
    }
  }

  onRequestAccount(): void {
    if (this.order) {
      this.modalService.close();
      this.navigationService.goTo('invoice', [this.order.id]);
    }
  }

  closeModal(): void {
    this.modalService.close();
  }
}
