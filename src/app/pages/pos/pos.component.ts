import { Component, OnInit, OnDestroy } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { formatDate } from '@angular/common';
import { PingService } from '@app/core/service/ping.service';
import { NavigationService } from '@app/core/service/navigation.service';
import { GoToDirective } from '@app/shared/directives/go-to.directive';
import { TodaySales } from '@app/core/model/order/today-sales';
import { OrderService } from '@app/core/service/order.service';
import { HasRoleDirective } from '@app/shared/directives/has-role.directive';
import { AuthService } from '@app/core/service/auth.service';
import { ToastService } from '@app/lib/toast/toast.service';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [LucideAngularModule, CommonModule, GoToDirective, HasRoleDirective],
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.css',
})
export class PosComponent implements OnInit, OnDestroy {
  currentDate: string = '';
  currentTime: string = '';
  private intervalId: any;
  private intervalPingId: any;
  serverStatus: boolean = true;
  networkOnline = navigator.onLine;
  path: string | null = null;
  todaySales: TodaySales | null = null;
  todaySalesError: string | null = null;

  constructor(
    private pingService: PingService,
    private navigantionService: NavigationService,
    private orderService: OrderService,
    private authService: AuthService,
    private toast: ToastService
  ) {
    this.updateDateTime();
  }

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.updateDateTime();
    }, 1000);

    this.intervalPingId = setInterval(() => this.checkServerStatus(), 10000);
    window.addEventListener('online', () => {
      this.networkOnline = true;
    });

    window.addEventListener('offline', () => {
      this.networkOnline = false;
    });

    this.navigantionService.configureNavbar([
      'home',
      'movements',
      'suppliers',
      'settings',
    ]);

    this.getTodaySales();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    if (this.intervalPingId) {
      clearInterval(this.intervalPingId);
    }
  }

  checkServerStatus() {
    this.pingService.ping().subscribe(
      (response) => {
        this.serverStatus = true;
      },
      (error) => {
        this.serverStatus = false;
      }
    );
  }

  private updateDateTime() {
    const now = new Date();
    this.currentDate = formatDate(now, 'EEEE, d MMMM, y', 'es-ES');
    this.currentTime = now.toLocaleTimeString('es-ES', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }

  getTodaySales() {
    this.orderService.getTodaySales().subscribe(
      (response) => {
        this.todaySales = response.data;
      },
      (error) => {
        this.toast.error(error.message);
        this.todaySalesError = error.message;
        this.todaySales = null;
      }
    );
  }

  navigateToTables() {
    if (this.todaySalesError) {
      this.toast.error(this.todaySalesError);
      return;
    }
    this.navigantionService.goTo('tables');
  }
}
