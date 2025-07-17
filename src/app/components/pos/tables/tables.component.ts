import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { WEBSOCKET_CHANNELS } from '@app/core/constant/websocket-channels';
import { TableStatusEnum } from '@app/core/enums/table-enum';
import { RestaurantTable } from '@app/core/model/data/restaurant-table';
import { CreateDraftOrderRequest } from '@app/core/model/order/create-draft-order';
import { LocalStorageService } from '@app/core/service/local-storage.service';
import { NavigationService } from '@app/core/service/navigation.service';
import { OrderStateService } from '@app/core/service/order-state.service';
import { OrderService } from '@app/core/service/order.service';
import { RestaurantTableService } from '@app/core/service/restaurant-table.service';
import { WebSocketService } from '@app/core/service/websocket.service';
import { ToastService } from '@app/lib/toast/toast.service';
import { BackBarComponent } from '@app/shared/back-bar/back-bar.component';
import { BasePageComponent } from '@app/shared/base-page/base-page.component';
import { LucideAngularModule } from 'lucide-angular';
import { ModalService } from 'ngx-modal-ease';
import { Subscription } from 'rxjs';
import { TableOrderDetailComponent } from './table-order-detail/table-order-detail.component';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [
    BasePageComponent,
    BackBarComponent,
    CommonModule,
    LucideAngularModule,
  ],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.css',
})
export class TablesComponent implements OnInit, OnDestroy {
  tablesMap = new Map<number, RestaurantTable>();
  availablesTablesMap = new Map<number, RestaurantTable>();
  occupiedTablesMap = new Map<number, RestaurantTable>();
  page = 1;
  size = 100;

  activeTab: number = 1;

  private wsSubscription?: Subscription;

  constructor(
    private webSocketService: WebSocketService,
    private tableService: RestaurantTableService,
    private navigationService: NavigationService,
    private toastService: ToastService,
    private orderService: OrderService,
    private orderStateService: OrderStateService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.tableService.getTables(this.page, this.size).subscribe((response) => {
      this.initializeTablesMaps(response.data.content);
    });

    this.suscribeToTableUpdates();

    this.navigationService.configureNavbar(['home', 'pos', 'tables']);
  }

  ngOnDestroy(): void {
    this.wsSubscription?.unsubscribe();
  }

  suscribeToTableUpdates() {
    this.wsSubscription = this.webSocketService
      .watch<RestaurantTable>(WEBSOCKET_CHANNELS.PUBLIC.TABLES)
      .subscribe({
        next: (update) => {
          this.handleTableUpdate(update);
        },
        error: (error) => {
          this.toastService.error('Error en la conexión con el servidor');
        },
      });
  }

  oSelectTable(tableId: number) {
    const request: CreateDraftOrderRequest = {
      tableId,
      guestsCount: 1,
    };

    this.orderService.createDraftOrder(request).subscribe({
      next: (response) => {
        this.toastService.success(
          'Orden creada',
          `Orden #${response.data.orderId}`
        );
        this.goToOrder(response.data.orderId);
      },
      error: (error) => {
        this.toastService.error(error.message);
      },
    });
  }

  goToOrder(orderId: number) {
    this.orderStateService.setOrderId(orderId);
    this.navigationService.goTo('menu');
  }

  private handleTableUpdate(update: RestaurantTable) {
    if (this.tablesMap.has(update.id)) {
      this.tablesMap.set(update.id, update);
    } else {
      this.tablesMap.set(update.id, update);
    }
    console.log('Update:', update);

    this.removeTableFromAllMaps(update.id);

    if (update.status === TableStatusEnum.AVAILABLE) {
      this.availablesTablesMap.set(update.id, update);
    } else {
      // Todos los demás estados van en el mapa de ocupadas
      this.occupiedTablesMap.set(update.id, update);
    }
  }

  private removeTableFromAllMaps(tableId: number) {
    this.availablesTablesMap.delete(tableId);
    this.occupiedTablesMap.delete(tableId);
  }

  private initializeTablesMaps(tables: RestaurantTable[]) {
    this.clearAllMaps();
    tables.forEach((table) => {
      this.tablesMap.set(table.id, table);

      if (table.status === TableStatusEnum.AVAILABLE) {
        this.availablesTablesMap.set(table.id, table);
      } else {
        this.occupiedTablesMap.set(table.id, table);
      }
    });
  }

  clearAllMaps() {
    this.tablesMap.clear();
    this.availablesTablesMap.clear();
    this.occupiedTablesMap.clear();
  }

  get availableTables(): RestaurantTable[] {
    return Array.from(this.availablesTablesMap.values());
  }

  get occupiedTables(): RestaurantTable[] {
    return Array.from(this.occupiedTablesMap.values());
  }

  openOrderDetail(tableId: number): void {
    this.modalService.open(TableOrderDetailComponent, {
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
        tableId,
      },
    });
  }

  getTableCardStyle(status: string): { button: string; background: string } {
    switch (status) {
      case TableStatusEnum.AVAILABLE:
        return { button: 'text-on-tertiary', background: 'bg-tertiary' };
      case TableStatusEnum.OCCUPIED:
        return { button: 'text-white', background: 'bg-primary-key' };
      case TableStatusEnum.RESERVED:
        return { button: 'text-on-background', background: 'bg-secondary' };
      case TableStatusEnum.READY_TO_PAY:
        return { button: 'text-background', background: 'bg-primary' };
      case TableStatusEnum.PAID:
        return { button: 'text-white', background: 'bg-secondary-key' };
      case TableStatusEnum.CANCELLED:
        return { button: 'text-on-error', background: 'bg-error' };
      case TableStatusEnum.NEED_CLEANING:
        return {
          button: 'text-on-tertiary-container',
          background: 'bg-tertiary-container',
        };
      default:
        return { button: 'border-gray-300', background: 'bg-white' };
    }
  }

  getTableStatusInfo(status: string): {
    color: string;
    text: string;
    icon: string;
  } {
    switch (status) {
      case TableStatusEnum.AVAILABLE:
        return {
          color: 'text-on-tertiary',
          text: 'Disponible',
          icon: 'circle-check',
        };
      case TableStatusEnum.OCCUPIED:
        return {
          color: 'text-primary-key',
          text: 'Ocupada',
          icon: 'dot',
        };
      case TableStatusEnum.RESERVED:
        return {
          color: 'text-secondary',
          text: 'Reservada',
          icon: 'calendar',
        };
      case TableStatusEnum.READY_TO_PAY:
        return {
          color: 'text-primary',
          text: 'Lista para pagar',
          icon: 'credit-card',
        };
      case TableStatusEnum.PAID:
        return {
          color: 'text-secondary-key',
          text: 'Pagada',
          icon: 'check-circle',
        };
      case TableStatusEnum.CANCELLED:
        return {
          color: 'text-error',
          text: 'Cancelada',
          icon: 'x-circle',
        };
      case TableStatusEnum.NEED_CLEANING:
        return {
          color: 'text-on-tertiary-fixed-variant',
          text: 'Necesita limpieza',
          icon: 'trash',
        };
      default:
        return {
          color: 'text-gray-800',
          text: status,
          icon: 'help-circle',
        };
    }
  }
}
