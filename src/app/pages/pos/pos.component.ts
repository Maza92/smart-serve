import { Component, OnInit, OnDestroy } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { formatDate } from '@angular/common';
import { PingService } from '@app/core/service/ping.service';
import { NavigationService } from '@app/core/service/navigation.service';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.css',
})
export class PosComponent implements OnInit, OnDestroy {
  currentDate: string = '';
  currentTime: string = '';
  private intervalId: any;
  serverStatus: boolean = true;
  networkOnline = navigator.onLine;
  path: string | null = null;

  constructor(
    private pingService: PingService,
    private navigantionService: NavigationService
  ) {
    this.updateDateTime();
  }

  ngOnInit() {
    this.path = this.navigantionService.getCurrentComponentPath();

    this.intervalId = setInterval(() => {
      this.updateDateTime();
    }, 1000);

    setInterval(() => this.checkServerStatus(), 10000);
    window.addEventListener('online', () => {
      this.networkOnline = true;
    });

    window.addEventListener('offline', () => {
      this.networkOnline = false;
    });

    this.navigantionService.addExclusions(
      ['Pos', 'Caja', 'Reportes', 'Clientes', 'Proveedores', 'Notificaciones'],
      this.path
    );
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
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
}
