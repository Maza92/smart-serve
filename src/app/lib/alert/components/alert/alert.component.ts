import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { AlertEvent, AlertItem } from '../../interfaces/alert';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
})
export class AlertComponent implements OnInit, OnDestroy {
  activeAlert: AlertItem | null = null;
  alertQueue: AlertItem[] = [];
  alertEvents$!: Observable<AlertEvent>;
  private subscription = new Subscription();

  ngOnInit() {
    this.subscription.add(
      this.alertEvents$.subscribe((event) => {
        if (event.id === 'close-all') {
          this.closeAllAlerts();
        } else if (event.config.message === '') {
          this.closeAlert(event.id);
        } else {
          this.addAlert(event);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.closeAllAlerts();
  }

  addAlert(event: AlertEvent) {
    const alert: AlertItem = {
      id: event.id,
      config: event.config,
    };

    this.alertQueue.push(alert);

    if (!this.activeAlert) {
      this.showNextAlert();
    }
  }

  showNextAlert() {
    if (this.alertQueue.length > 0) {
      this.activeAlert = this.alertQueue.shift()!;
    } else {
      this.activeAlert = null;
    }
  }

  closeAlert(id?: string) {
    if (id && this.activeAlert && this.activeAlert.id !== id) {
      this.alertQueue = this.alertQueue.filter((a) => a.id !== id);
      return;
    }

    this.activeAlert = null;
    this.showNextAlert();
  }

  closeAllAlerts() {
    this.activeAlert = null;
    this.alertQueue = [];
  }

  handleButtonClick(action: () => void) {
    action();
    this.closeAlert();
  }
}
