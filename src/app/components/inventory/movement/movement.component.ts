import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasePageComponent } from '@app/shared/base-page/base-page.component';
import { LucideAngularModule } from 'lucide-angular';
import { ModalService } from 'ngx-modal-ease';
import { OptionSelectComponent } from './option-select/option-select.component';
import { Router } from '@angular/router';
import { InventoryMovement } from '@app/core/model/data/inventory-movement';
import { finalize, Subject, takeUntil } from 'rxjs';
import { InventoryMovementService } from '@app/core/service/inventory-movement.service';
import { NavigationService } from '@app/core/service/navigation.service';
import { ToastService } from '@app/lib/toast/toast.service';

@Component({
  selector: 'app-movement',
  standalone: true,
  imports: [BasePageComponent, LucideAngularModule],
  templateUrl: './movement.component.html',
  styleUrl: './movement.component.css',
})
export class MovementComponent implements OnInit, OnDestroy {
  movements: InventoryMovement[] = [];
  page = 1;
  size = 10;
  hasMore = true;
  loading = false;

  path: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private inventoryMovementService: InventoryMovementService,
    private navigationService: NavigationService,
    private toastService: ToastService,
    private modalService: ModalService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.path = this.navigationService.getCurrentComponentPath();

    this.navigationService.addExclusions(
      [
        'Inventario',
        'Ajustes',
        'Caja',
        'Reportes',
        'Clientes',
        'Notificaciones',
        'Proveedores',
      ],
      this.path
    );

    this.loadMovements();
  }

  openOptionSelectModal() {
    this.modalService.open(OptionSelectComponent, {
      modal: {
        enter: 'enter-going-up 0.1s ease-out',
        leave: 'leave-going-down 0.1s ease-out',
        top: '50%',
        left: '50%',
      },
      overlay: {
        enter: 'fade-in 0.3s ease-out',
        leave: 'fade-out 0.2s ease-in',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },

      size: {
        width: '100%',
        height: '334px',
        padding: '0px 0.5rem',
      },
      actions: {
        escape: true,
        click: true,
      },
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMovements(loadMore: boolean = false) {
    if (this.loading) return;

    if (loadMore) {
      this.page++;
    }

    this.loading = true;

    this.inventoryMovementService
      .getLastMovements(this.page, this.size)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.loading = false))
      )
      .subscribe({
        next: (response) => {
          const newData = response.data.content;

          if (loadMore) {
            this.movements = [...this.movements, ...newData];
          } else {
            this.movements = newData;
          }

          this.hasMore = newData.length === response.data.totalElements;
        },
        error: (error) => {
          this.toastService.error('Error', error.message, {
            position: 'top-center',
            showCloseButton: false,
            showProgressBar: false,
            duration: 3000,
          });
        },
      });
  }

  resetAndLoad() {
    this.page = 1;
    this.loadMovements();
  }

  loadMore(): void {
    if (this.hasMore && !this.loading) {
      this.loadMovements(true);
    }
  }
}
