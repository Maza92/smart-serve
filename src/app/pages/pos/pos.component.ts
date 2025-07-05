import { Component, OnInit, OnDestroy } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { formatDate } from '@angular/common';
import { PingService } from '@app/core/service/ping.service';
import { NavigationService } from '@app/core/service/navigation.service';
import { RouterLink } from '@angular/router';
import { GoToDirective } from '@app/shared/directives/go-to.directive';
import { TodaySales } from '@app/core/model/order/today-sales';
import { OrderService } from '@app/core/service/order.service';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [LucideAngularModule, CommonModule, RouterLink, GoToDirective],
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

  constructor(
    private pingService: PingService,
    private navigantionService: NavigationService,
    private orderService: OrderService
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
        this.todaySales = null;
      }
    );
  }
}
