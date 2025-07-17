import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { WEBSOCKET_CHANNELS } from '@app/core/constant/websocket-channels';
import {
  ActivityTypeEnum,
  CategoryStockLevel,
  DashboardUpdate,
  InventoryDashboard,
  InventoryMetrics,
  RecentActivity,
  UpdateTypeEnum,
} from '@app/core/model/data/inventory-dashboard';
import { InventoryService } from '@app/core/service/inventory.service';
import { NavigationService } from '@app/core/service/navigation.service';
import { WebSocketService } from '@app/core/service/websocket.service';
import { BackBarComponent } from '@app/shared/back-bar/back-bar.component';
import { BasePageComponent } from '@app/shared/base-page/base-page.component';
import { LucideAngularModule } from 'lucide-angular';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [BasePageComponent, LucideAngularModule, CommonModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css',
})
export class InventoryComponent implements OnInit, OnDestroy {
  path: string | null = null;
  public dashboardData?: InventoryDashboard;
  public isLoading = true;

  private destroy$ = new Subject<void>();

  constructor(
    private navigationService: NavigationService,
    private inventoryService: InventoryService,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.navigationService.configureNavbar(['home', 'items', 'suppliers']);
    this.loadInitData();
    this.connectToWebsocket();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  connectToWebsocket() {
    this.webSocketService
      .watch<DashboardUpdate>(WEBSOCKET_CHANNELS.PUBLIC.INVENTORY_DASHBOARD)
      .pipe(takeUntil(this.destroy$))
      .subscribe((update) => {
        console.log('Received dashboard update:', update);
        this.handleUpdate(update);
      });
  }

  handleUpdate(update: DashboardUpdate): void {
    if (!this.dashboardData) return;

    switch (update.updateType) {
      case UpdateTypeEnum.NEW_ACTIVITY:
        // Añade la nueva actividad al principio de la lista y limita el tamaño
        const newActivity = update.data as RecentActivity;
        this.dashboardData.recentActivities.unshift(newActivity);
        if (this.dashboardData.recentActivities.length > 10) {
          this.dashboardData.recentActivities.pop();
        }
        break;

      case UpdateTypeEnum.METRICS_UPDATE:
        // Actualiza todo el bloque de métricas
        this.dashboardData.metrics = update.data as InventoryMetrics;
        break;

      case UpdateTypeEnum.STOCK_LEVEL_UPDATE:
        // Actualiza la lista de niveles de stock
        this.dashboardData.categoryStockLevels =
          update.data as CategoryStockLevel[];
        break;

      // ... otros casos de actualización
    }
    // Actualiza la fecha de última actualización
    this.dashboardData.lastUpdated = update.timestamp;
  }

  loadInitData() {
    this.inventoryService.getDashboardData().subscribe({
      next: (response) => {
        this.dashboardData = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      },
    });
  }

  getActivityIcon(activityType: ActivityTypeEnum): string {
    switch (activityType) {
      case ActivityTypeEnum.INVENTORY_PURCHASE:
        return 'shopping-cart';
      case ActivityTypeEnum.INVENTORY_ADJUSTMENT:
        return 'edit';
      case ActivityTypeEnum.INVENTORY_EXPIRY:
        return 'calendar-x';
      case ActivityTypeEnum.ORDER_COMPLETED:
        return 'check-circle';
      case ActivityTypeEnum.LOW_STOCK_ALERT:
        return 'alert-triangle';
      case ActivityTypeEnum.CATEGORY_CREATED:
        return 'folder-plus';
      case ActivityTypeEnum.ITEM_CREATED:
        return 'plus-circle';
      default:
        return 'activity';
    }
  }
}
