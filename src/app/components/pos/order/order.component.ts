import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { OrderItem, OrderState } from '@app/core/model/order-state/order-state';
import { OrderModification } from '@app/core/model/order/modifications';
import { UpdateOrderWithDetailsRequest } from '@app/core/model/order/update-order-with-details';
import { NavigationService } from '@app/core/service/navigation.service';
import { OrderStateService } from '@app/core/service/order-state.service';
import { OrderService } from '@app/core/service/order.service';
import { ToastService } from '@app/lib/toast/toast.service';
import { BackBarComponent } from '@app/shared/back-bar/back-bar.component';
import { BasePageComponent } from '@app/shared/base-page/base-page.component';
import { SwipeButtonComponent } from '@app/shared/swipe-button/swipe-button.component';
import { LucideAngularModule } from 'lucide-angular';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { IngredientEditorComponent } from './ingredient-editor/ingredient-editor.component';
import { ModalService } from 'ngx-modal-ease';
import { OrderServiceType } from '@app/core/enums/order-enum';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    BasePageComponent,
    BackBarComponent,
    CommonModule,
    LucideAngularModule,
    SwipeButtonComponent,
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css',
})
export class OrderComponent implements OnInit, OnDestroy {
  public selectedItems$: Observable<OrderItem[]>;
  public orderState$: Observable<OrderState>;
  private orderId: number | null = null;
  private destroy$ = new Subject<void>();
  activeTab: number = 1;
  @ViewChild(SwipeButtonComponent) swipeButton!: SwipeButtonComponent;
  public expandedItems: { [key: number]: boolean } = {};

  constructor(
    private navigationService: NavigationService,
    private orderService: OrderService,
    private toastService: ToastService,
    private orderStateService: OrderStateService,
    private modalService: ModalService
  ) {
    this.selectedItems$ = this.orderStateService.items$;
    this.orderState$ = this.orderStateService.orderState$;
  }

  ngOnInit(): void {
    this.orderState$.subscribe((state) => {
      if (!state.orderId) {
        this.navigationService.goTo('menu');
      }
      this.orderId = state.orderId;
    });
    this.navigationService.configureNavbar(['home', 'pos', 'sales']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setCustomerName(event: Event): void {
    let customerName = (event.target as HTMLInputElement).value as string;
    if (!customerName) customerName = 'anónimo';
    this.orderStateService.setCustomerName(customerName);
  }

  setServiceType(event: Event): void {
    let serviceType = (event.target as HTMLInputElement).value as string;
    if (!serviceType) serviceType = OrderServiceType.DINE_IN;
    this.orderStateService.setServiceType(serviceType as OrderServiceType);
  }

  setComments(event: Event): void {
    let comments = (event.target as HTMLInputElement).value as string;
    if (!comments) comments = 'Todo bien';
    this.orderStateService.setComments(comments);
  }

  sendToKitchen(): void {
    const request: UpdateOrderWithDetailsRequest | null =
      this.orderStateService.buildUpdateRequest();

    if (!request) {
      this.toastService.error(' No se puede enviar el pedido', 'Error');
      return;
    }

    if (!this.orderId) {
      this.toastService.error('No hay pedido creado', 'Error');
      this.navigationService.goTo('menu');
      return;
    }

    this.orderService.sendToKitchen(request, this.orderId).subscribe({
      next: (response) => {
        this.toastService.success('Pedido enviado a la cocina', 'Éxito');
        this.swipeButton.markAsSuccess();
        this.orderStateService.resetState();
        this.navigationService.goTo('tables');
      },
      error: (error) => {
        this.swipeButton.markAsFailure();
        this.toastService.error(error.message);
      },
    });
  }

  increaseQuantity(item: OrderItem): void {
    this.orderStateService.updateItemQuantity(item.dishId, item.quantity + 1);
  }

  decreaseQuantity(item: OrderItem): void {
    this.orderStateService.updateItemQuantity(item.dishId, item.quantity - 1);
  }

  openIngredientEditor(item: OrderItem): void {
    this.modalService.open(IngredientEditorComponent, {
      modal: {
        enter: 'enter-scaling 0.1s ease-out',
        leave: 'fade-out 0.1s ease-out',
        top: '50',
        left: '50%',
      },
      overlay: {
        enter: 'fade-in 0.3s ease-out',
        leave: 'fade-out 0.2s ease-in',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      size: {
        width: '100%',
      },
      actions: {
        escape: true,
        click: true,
      },
      data: {
        dishId: item.dishId,
        currentModifications: item.modifications,
      },
    });
  }

  getModificationsSummary(modifications: OrderModification[]): string {
    if (!modifications || modifications.length === 0) {
      return 'Sin modificaciones';
    }

    const summary = modifications
      .filter((mod) => mod.action !== 'NOTE')
      .map((mod) => {
        switch (mod.action) {
          case 'REMOVE':
            return `Sin ${mod.ingredientName}`;
          case 'ADD':
            return `+ ${mod.ingredientName}`;
          case 'EXTRA':
            return `Extra ${mod.ingredientName}`;
          case 'LESS':
            return `Menos ${mod.ingredientName}`;
          default:
            return mod.ingredientName;
        }
      })
      .slice(0, 2)
      .join(', ');

    const noteModification = modifications.find((mod) => mod.action === 'NOTE');
    if (noteModification) {
      return summary + (summary ? ', ' : '') + 'Notas especiales';
    }

    return summary + (modifications.length > 2 ? '...' : '');
  }

  get disabled(): Observable<boolean> {
    return this.selectedItems$.pipe(map((items) => items.length === 0));
  }

  toggleItemExpansion(itemId: number): void {
    this.expandedItems[itemId] = !this.expandedItems[itemId];
  }
}
