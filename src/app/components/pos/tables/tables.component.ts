import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { WEBSOCKET_CHANNELS } from '@app/core/constant/websocket-channels';
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
import { Subscription } from 'rxjs';

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
    private orderStateService: OrderStateService
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

    this.removeTableFromAllMaps(update.id);

    switch (update.status) {
      case 'AVAILABLE':
        this.availablesTablesMap.set(update.id, update);
        break;
      case 'OCCUPIED':
        this.occupiedTablesMap.set(update.id, update);
        break;
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

      switch (table.status) {
        case 'AVAILABLE':
          this.availablesTablesMap.set(table.id, table);
          break;
        case 'OCCUPIED':
          this.occupiedTablesMap.set(table.id, table);
          break;
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
}
