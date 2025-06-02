import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Supplier } from '@app/core/model/data/supplier';
import { SupplierService } from '@app/core/service/supplier.service';
import { ToastService } from '@app/lib/toast/toast.service';
import { LucideAngularModule } from 'lucide-angular';
import { ModalService } from 'ngx-modal-ease';
import { Subject, takeUntil } from 'rxjs';
import { EditSupplierComponent } from '../edit-supplier/edit-supplier.component';
import { BasePageComponent } from '@app/shared/base-page/base-page.component';

@Component({
  selector: 'app-supplier-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, BasePageComponent],
  templateUrl: './supplier-detail.component.html',
  styleUrl: './supplier-detail.component.css',
})
export class SupplierDetailComponent implements OnInit, OnDestroy {
  supplier: Supplier | null = null;
  loading = true;
  deleting = false;
  supplierId!: number;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supplierService: SupplierService,
    private modalService: ModalService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.supplierId = +params['id'];
      this.loadSupplier();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSupplier(): void {
    this.loading = true;
    this.supplierService.getSupplierById(this.supplierId).subscribe({
      next: (response) => {
        this.supplier = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar el proveedor:', error);
        this.toastService.error('Error al cargar el proveedor');
        this.loading = false;
        this.router.navigate(['/home/inventory/suppliers']);
      },
    });
  }

  openEditModal(): void {
    if (!this.supplier) return;

    this.modalService
      .open(EditSupplierComponent, {
        data: { supplier: this.supplier },
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
      })
      .then((result) => {
        if (result) {
          this.loadSupplier();
        }
      });
  }

  confirmDelete(): void {
    if (confirm('¿Está seguro de eliminar este proveedor?')) {
      this.deleteSupplier();
    }
  }

  deleteSupplier(): void {
    this.deleting = true;
    this.supplierService.deleteSupplier(this.supplierId).subscribe({
      next: () => {
        this.toastService.success('Proveedor eliminado correctamente');
        this.router.navigate(['/home/inventory/suppliers']);
      },
      error: (error) => {
        console.error('Error al eliminar el proveedor:', error);
        this.toastService.error('Error al eliminar el proveedor');
        this.deleting = false;
      },
    });
  }
}
