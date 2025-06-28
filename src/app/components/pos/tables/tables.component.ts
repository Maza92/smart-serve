import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WEBSOCKET_CHANNELS } from '@app/core/constant/websocket-channels';
import { RestaurantTable } from '@app/core/model/data/restaurant-table';
import { LocalStorageService } from '@app/core/service/local-storage.service';
import { RestaurantTableService } from '@app/core/service/restaurant-table.service';
import { WebSocketService } from '@app/core/service/websocket.service';
import { BackBarComponent } from '@app/shared/back-bar/back-bar.component';
import { BasePageComponent } from '@app/shared/base-page/base-page.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [BasePageComponent, BackBarComponent, CommonModule],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.css',
})
export class TablesComponent implements OnInit {
  tables: RestaurantTable[] = [];
  private tableStatusSubscription: Subscription | undefined;
  constructor(
    private webSocketService: WebSocketService,
    private tableService: RestaurantTableService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.tableService.getTables(1, 10).subscribe((response) => {
      this.tables = response.data.content;
    });
  }

  connect() {
    const token = this.localStorageService.get('auth_token') as string;
    this.webSocketService.connect(token);
  }

  disconnect() {
    this.webSocketService.disconnect();
  }

  init() {
    this.tableStatusSubscription = this.webSocketService
      .watch<RestaurantTable>(WEBSOCKET_CHANNELS.PUBLIC.TABLES)
      .subscribe((updatedTable: RestaurantTable) => {
        console.log(
          '¡Actualización de mesa recibida por WebSocket!',
          updatedTable
        );

        // 3. Buscamos la mesa en nuestra lista y la actualizamos (la reacción)
        const index = this.tables.findIndex((t) => t.id === updatedTable.id);
        if (index !== -1) {
          this.tables[index] = updatedTable;
        } else {
          // Si es una mesa nueva, la añadimos
          this.tables.push(updatedTable);
        }
      });
  }
}
