import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { App as CapacitorApp } from '@capacitor/app';
import { WebSocketService } from './core/service/websocket.service';
import { WEBSOCKET_CHANNELS } from './core/constant/websocket-channels';
import { ToastService } from './lib/toast/toast.service';
import { Notification } from './core/model/data/notification';
import { RxStomp } from '@stomp/rx-stomp';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'smart-serve';
  private destroy$ = new Subject<void>();
  constructor(
    private websocketService: WebSocketService,
    private toastService: ToastService
  ) {
    CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack || window.history.length > 1) {
        window.history.back();
      } else {
        CapacitorApp.exitApp();
      }
    });
  }

  ngOnInit(): void {
    this.websocketService
      .getState()
      .pipe(
        filter((state) => state === 'CONNECTED'),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        console.log(
          'Conectado al WebSocket por primera vez o tras reconexión. Suscribiendo a notificaciones...'
        );
        this.watchNotifications();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  watchNotifications(): void {
    this.websocketService
      .watch<Notification>(WEBSOCKET_CHANNELS.PRIVATE.NOTIFICATIONS)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (message) => {
          console.log('Notification received:', message);
          if (message.type === 'success') {
            this.toastService.success(message.message);
          } else {
            this.toastService.info(message.message);
          }
        },
        error: (error) => {
          console.error('Error watching notifications:', error.message);
        },
      });
  }
}
