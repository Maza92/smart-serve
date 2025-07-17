import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { WEBSOCKET_CHANNELS } from '@app/core/constant/websocket-channels';
import { OrderStatusEnum } from '@app/core/enums/order-enum';
import { OrderToKitchen } from '@app/core/model/data/order';
import {
  OrderModification,
  OrderModificationAction,
} from '@app/core/model/order/modifications';
import { NavigationService } from '@app/core/service/navigation.service';
import { OrderService } from '@app/core/service/order.service';
import { WebSocketService } from '@app/core/service/websocket.service';
import { ToastService } from '@app/lib/toast/toast.service';
import { BasePageComponent } from '@app/shared/base-page/base-page.component';
import { GoToDirective } from '@app/shared/directives/go-to.directive';
import { LucideAngularModule } from 'lucide-angular';
import { Subscription } from 'rxjs';

interface OrderTimer {
  orderId: number;
  startTime: number;
  interval?: any;
}

@Component({
  selector: 'app-kitchen',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, GoToDirective],
  templateUrl: './kitchen.component.html',
  styleUrl: './kitchen.component.css',
})
export class KitchenComponent implements OnInit, OnDestroy {
  ordersMap = new Map<number, OrderToKitchen>();
  pendingOrdersMap = new Map<number, OrderToKitchen>();
  inPreparationOrdersMap = new Map<number, OrderToKitchen>();
  readyOrdersMap = new Map<number, OrderToKitchen>();

  orderTimers = new Map<number, OrderTimer>();

  page: number = 1;
  size: number = 100;
  activeTab: number = 1;

  private wsSubscription?: Subscription;
  private animatingOrders = new Set<number>();

  constructor(
    private orderService: OrderService,
    private navigationService: NavigationService,
    private webSocketService: WebSocketService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadInitialOrders();
    this.subscribeToOrderUpdates();
    this.navigationService.configureNavbar(['home', 'pos', 'settings']);
  }

  ngOnDestroy(): void {
    this.wsSubscription?.unsubscribe();
    this.clearAllTimers();
  }

  loadInitialOrders() {
    this.orderService.getDishesToKitchen(this.page, this.size).subscribe({
      next: (response) => {
        const orders = response.data.content;
        this.initializeOrderMaps(orders);
        this.startTimersForInPreparation();
      },
      error: (error) => {
        console.error('Error getting orders', error);
      },
    });
  }

  subscribeToOrderUpdates() {
    this.wsSubscription = this.webSocketService
      .watch<OrderToKitchen>(WEBSOCKET_CHANNELS.PUBLIC.KITCHEN_ORDER_UPDATES)
      .subscribe({
        next: (update) => {
          this.handleOrderUpdate(update);
          console.log('Actualización de pedido recibida:', update);
        },
        error: (error) => {
          this.toastService.error('Error en la conexión con el servidor');
        },
      });
  }

  private initializeOrderMaps(orders: OrderToKitchen[]) {
    this.clearAllMaps();

    orders.forEach((order) => {
      this.ordersMap.set(order.id, order);

      switch (order.status) {
        case OrderStatusEnum.SENT_TO_KITCHEN:
          this.pendingOrdersMap.set(order.id, order);
          break;
        case OrderStatusEnum.IN_PREPARATION:
          this.inPreparationOrdersMap.set(order.id, order);
          break;
        case OrderStatusEnum.READY:
          this.readyOrdersMap.set(order.id, order);
          break;
      }
    });
  }

  private handleOrderUpdate(update: OrderToKitchen) {
    if (this.animatingOrders.has(update.id)) {
      return;
    }

    this.animatingOrders.add(update.id);

    setTimeout(() => {
      this.moveOrderBetweenMaps(update, update.status);
      this.animatingOrders.delete(update.id);
    }, 300);
  }

  private moveOrderBetweenMaps(
    order: OrderToKitchen,
    newStatus: OrderStatusEnum
  ) {
    this.removeOrderFromAllMaps(order.id);

    order.status = newStatus;
    this.ordersMap.set(order.id, order);

    switch (newStatus) {
      case OrderStatusEnum.SENT_TO_KITCHEN:
        this.pendingOrdersMap.set(order.id, order);
        break;
      case OrderStatusEnum.IN_PREPARATION:
        this.inPreparationOrdersMap.set(order.id, order);
        this.startTimer(order.id);
        break;
      case OrderStatusEnum.READY:
        this.readyOrdersMap.set(order.id, order);
        this.stopTimer(order.id);
        break;
      case OrderStatusEnum.SERVED:
        this.stopTimer(order.id);
        this.ordersMap.delete(order.id);
        break;
    }
  }

  private removeOrderFromAllMaps(orderId: number) {
    this.pendingOrdersMap.delete(orderId);
    this.inPreparationOrdersMap.delete(orderId);
    this.readyOrdersMap.delete(orderId);
  }

  private clearAllMaps() {
    this.ordersMap.clear();
    this.pendingOrdersMap.clear();
    this.inPreparationOrdersMap.clear();
    this.readyOrdersMap.clear();
  }

  private startTimersForInPreparation() {
    this.inPreparationOrdersMap.forEach((order) => {
      this.startTimer(order.id);
    });
  }

  private startTimer(orderId: number) {
    this.stopTimer(orderId);

    const timer: OrderTimer = {
      orderId,
      startTime: Date.now(),
    };

    timer.interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - timer.startTime) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;

      const element = document.getElementById(`timer-${orderId}`);
      if (element) {
        element.textContent = `${minutes.toString().padStart(2, '0')}:${seconds
          .toString()
          .padStart(2, '0')}`;
      }
    }, 1000);

    this.orderTimers.set(orderId, timer);
  }

  private stopTimer(orderId: number) {
    const timer = this.orderTimers.get(orderId);
    if (timer?.interval) {
      clearInterval(timer.interval);
      this.orderTimers.delete(orderId);
    }
  }

  private clearAllTimers() {
    this.orderTimers.forEach((timer) => {
      if (timer.interval) {
        clearInterval(timer.interval);
      }
    });
    this.orderTimers.clear();
  }

  onStartOrder(orderId: number) {
    this.orderService.claimToCook(orderId).subscribe({
      error: (error) => {
        this.toastService.error(error.message);
      },
    });
  }

  onMarkReady(orderId: number) {
    this.orderService.markAsReady(orderId).subscribe({
      error: (error) => {
        this.toastService.error(error.message);
      },
    });
  }

  scrollToTop(containerId: string) {
    const container = document.getElementById(containerId);
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  get pendingOrdersArray(): OrderToKitchen[] {
    return Array.from(this.pendingOrdersMap.values());
  }

  get inPreparationOrdersArray(): OrderToKitchen[] {
    return Array.from(this.inPreparationOrdersMap.values());
  }

  get readyOrdersArray(): OrderToKitchen[] {
    return Array.from(this.readyOrdersMap.values());
  }

  isAnimating(orderId: number): boolean {
    return this.animatingOrders.has(orderId);
  }

  trackByOrderId(index: number, order: OrderToKitchen): number {
    return order.id;
  }

  getModificationText(modification: OrderModification): string {
    switch (modification.action) {
      case OrderModificationAction.REMOVE:
        return `Sin ${modification.ingredientName}`;
      case OrderModificationAction.ADD:
        return `+ ${modification.ingredientName}`;
      case OrderModificationAction.EXTRA:
        return `Extra ${modification.ingredientName}`;
      case OrderModificationAction.LESS:
        return `Menos ${modification.ingredientName}`;
      case OrderModificationAction.NOTE:
        return modification.ingredientName;
      default:
        return modification.ingredientName;
    }
  }

  getModificationClass(modification: OrderModification): string {
    switch (modification.action) {
      case OrderModificationAction.REMOVE:
        return 'text-red-600 bg-red-50 border-red-200';
      case OrderModificationAction.ADD:
        return 'text-green-600 bg-green-50 border-green-200';
      case OrderModificationAction.EXTRA:
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case OrderModificationAction.LESS:
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case OrderModificationAction.NOTE:
        return 'text-purple-600 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  }

  getModificationIcon(modification: OrderModification): string {
    switch (modification.action) {
      case OrderModificationAction.REMOVE:
        return 'x';
      case OrderModificationAction.ADD:
        return 'plus';
      case OrderModificationAction.EXTRA:
        return 'plus-circle';
      case OrderModificationAction.LESS:
        return 'minus-circle';
      case OrderModificationAction.NOTE:
        return 'message-circle';
      default:
        return 'info';
    }
  }
}
