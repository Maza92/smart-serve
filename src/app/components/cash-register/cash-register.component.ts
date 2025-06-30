import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CashRegister } from '@app/core/model/data/cash-register';
import { CashRegisterService } from '@app/core/service/cash-register.service';
import { ToastService } from '@app/lib/toast/toast.service';
import { BackBarComponent } from '@app/shared/back-bar/back-bar.component';
import { LucideAngularModule } from 'lucide-angular';
import { ModalService, Options } from 'ngx-modal-ease';
import { CreateCashRegisterComponent } from './create-cash-register/create-cash-register.component';
import { CreateCashRegisterRequest } from '@app/core/model/cash/create-cash-register-request';
import { OpenCashRegisterRequest } from '@app/core/model/cash/open-cash-register-request';
import { OpenCashRegisterComponent } from './open-cash-register/open-cash-register.component';
import { Type } from '@angular/core';
import { CloseCashRegisterComponent } from './close-cash-register/close-cash-register.component';
import { finalize } from 'rxjs';
import { NavigationService } from '@app/core/service/navigation.service';

@Component({
  selector: 'app-cash-register',
  standalone: true,
  imports: [BackBarComponent, CommonModule, LucideAngularModule],
  templateUrl: './cash-register.component.html',
  styleUrl: './cash-register.component.css',
})
export class CashRegisterComponent implements OnInit {
  cashRegisters: CashRegister[] = [];
  page = 1;
  pageSize = 5;
  hasMore = true;
  loading = false;
  status: string = 'NONE';

  constructor(
    private cashRegisterService: CashRegisterService,
    private toastService: ToastService,
    private modalService: ModalService,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    this.loadCashRegisters();
    this.getStatus();
    this.navigationService.configureNavbar(['home', 'settings']);
  }

  resetAndReload() {
    this.page = 1;
    this.loadCashRegisters();
  }

  loadCashRegisters(loadMore: boolean = false): void {
    if (this.loading) return;

    if (loadMore) {
      this.page++;
    }

    this.loading = true;

    this.cashRegisterService
      .getCashRegisters(this.page, this.pageSize, 'DESC', 'createdAt')
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          const newData = response.data.content;

          if (loadMore) {
            this.cashRegisters = [...this.cashRegisters, ...newData];
          } else {
            this.cashRegisters = newData;
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
      this.loadCashRegisters(true);
    }
  }

  CreateCashRegisterModal(): void {
    if (this.status !== 'NONE' && this.status !== 'CLOSED') return;

    this.modalService
      .open(CreateCashRegisterComponent, this.modalOptions)
      .then(() => {
        this.getStatus();
        this.resetAndReload();
      });
  }

  openCashRegister(): void {
    if (this.status !== 'CREATED') return;

    this.modalService
      .open(OpenCashRegisterComponent, this.modalOptions)
      .then(() => {
        this.getStatus();
        this.resetAndReload();
      });
  }

  closeCashRegister(): void {
    if (this.status !== 'OPENED') return;

    this.modalService
      .open(CloseCashRegisterComponent, this.modalOptions)
      .then(() => {
        this.getStatus();
        this.resetAndReload();
      });
  }

  getStatus() {
    this.cashRegisterService.getStatus().subscribe((response) => {
      this.status = response.data;
    });
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

  getPinStyle(status: string) {
    const styleMap = {
      CREATED: {
        bg: 'bg-primary-key',
        text: 'text-white',
      },
      OPENED: {
        bg: 'bg-green-100',
        text: 'text-green-700',
      },
      CLOSED: {
        bg: 'bg-red-100',
        text: 'text-red-700',
      },
    };
    return styleMap[status as keyof typeof styleMap] || styleMap['CLOSED'];
  }
}
