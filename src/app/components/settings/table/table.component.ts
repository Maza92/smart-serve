import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantTable } from '@app/core/model/data/restaurant-table';
import { RestaurantTableService } from '@app/core/service/restaurant-table.service';
import { ToastService } from '@app/lib/toast/toast.service';
import { BackBarComponent } from '@app/shared/back-bar/back-bar.component';
import { LucideAngularModule } from 'lucide-angular';
import { BasePageComponent } from '@app/shared/base-page/base-page.component';
import { finalize } from 'rxjs';
import { ModalService, Options } from 'ngx-modal-ease';
import { CreateTableComponent } from './create-table/create-table.component';
import { EditTableComponent } from './edit-table/edit-table.component';
import { AlertService } from '@app/lib/alert/alert.service';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    BackBarComponent,
    CommonModule,
    LucideAngularModule,
    BasePageComponent,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent implements OnInit {
  tables: RestaurantTable[] = [];
  page = 1;
  pageSize = 5;
  hasMore = true;
  loading = false;

  constructor(
    private tableService: RestaurantTableService,
    private toastService: ToastService,
    private modalService: ModalService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadTables();
  }

  loadTables(loadMore: boolean = false): void {
    if (this.loading) return;

    if (loadMore) {
      this.page++;
    }

    this.loading = true;

    this.tableService
      .getTables(this.page, this.pageSize)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          const newData = response.data.content;

          if (loadMore) {
            this.tables = [...this.tables, ...newData];
          } else {
            this.tables = newData;
          }

          this.hasMore = newData.length === this.pageSize;
        },
        error: (error) => {
          this.toastService.error('Error', error.message);
        },
      });
  }

  loadMore(): void {
    if (this.hasMore && !this.loading) {
      this.loadTables(true);
    }
  }

  createTableModal(): void {
    this.modalService
      .open(CreateTableComponent, this.modalOptions)
      .then((result) => {
        if (result) {
          this.page = 1;
          this.loadTables();
        }
      });
  }

  editTableModal(tableId: number): void {
    this.modalService
      .open(EditTableComponent, {
        ...this.modalOptions,
        data: {
          tableId,
        },
      })
      .then((result) => {
        if (result) {
          this.page = 1;
          this.loadTables();
        }
      });
  }

  deleteTable(tableId: number): void {
    this.alertService.warning(
      '¿Estás seguro de eliminar esta mesa?',
      'Eliminar mesa',
      {
        buttons: [
          {
            type: 'danger',
            text: 'Eliminar',
            action: () => {
              console.log('Eliminar mesa con ID:', tableId);
            },
          },
          {
            type: 'secondary',
            text: 'Cancelar',
            action: () => {
              console.log('Cancelar eliminación de mesa');
            },
          },
        ],
      }
    );
    console.log('Eliminar mesa con ID:', tableId);
  }

  private get modalOptions(): Options {
    return {
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
        maxHeight: '80vh',
      },
      actions: {
        escape: true,
        click: true,
      },
    };
  }
}
