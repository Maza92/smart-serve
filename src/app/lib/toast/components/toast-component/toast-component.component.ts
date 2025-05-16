import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ToastEvent, ToastItem } from '../../interfaces/toast';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-toast-component',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './toast-component.component.html',
  styleUrl: './toast-component.component.css',
})
export class ToastComponentComponent implements OnInit, OnDestroy {
  toasts: ToastItem[] = [];
  toastEvents$!: Observable<ToastEvent>;
  private subscription = new Subscription();

  ngOnInit() {
    this.subscription.add(
      this.toastEvents$.subscribe((event) => {
        if (event.id === 'clear-all') {
          this.clearAllToasts();
        } else if (event.config.duration === 0) {
          this.removeToast(event.id);
        } else {
          this.addToast(event);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.clearAllToasts();
  }

  addToast(event: ToastEvent) {
    const toast: ToastItem = {
      id: event.id,
      config: event.config,
    };

    this.toasts = [...this.toasts, toast];

    if (toast.config.duration && toast.config.duration > 0) {
      toast.timeoutId = window.setTimeout(() => {
        this.removeToast(toast.id);
      }, toast.config.duration);
    }
  }

  removeToast(id: string) {
    const toast = this.toasts.find((t) => t.id === id);
    if (toast?.timeoutId) {
      clearTimeout(toast.timeoutId);
    }
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }

  clearAllToasts() {
    this.toasts.forEach((toast) => {
      if (toast.timeoutId) {
        clearTimeout(toast.timeoutId);
      }
    });
    this.toasts = [];
  }

  pauseToast(toast: ToastItem) {
    if (toast.timeoutId) {
      clearTimeout(toast.timeoutId);
      toast.timeoutId = undefined;
    }
  }

  resumeToast(toast: ToastItem) {
    if (
      toast.config.duration &&
      toast.config.duration > 0 &&
      !toast.timeoutId
    ) {
      toast.timeoutId = window.setTimeout(() => {
        this.removeToast(toast.id);
      }, toast.config.duration);
    }
  }

  handleAction(action: () => void, toastId: string) {
    action();
    this.removeToast(toastId);
  }

  getPositionClass(): string {
    if (this.toasts.length === 0) return 'top-right';
    return this.toasts[0].config.position || 'top-right';
  }
}
