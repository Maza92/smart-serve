import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { NavigationService } from '../../core/service/navigation.service';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/core/service/auth.service';
import { GoToDirective } from '@app/shared/directives/go-to.directive';
import { NotificationService } from '@app/core/service/notification.service';
import { filter, Subject, takeUntil } from 'rxjs';
import { notifiactionFilterOptions } from '@app/core/model/filter-options';
import {
  Notification,
  MarkReadingNotification,
} from '@app/core/model/data/notification';
import { HasRoleDirective } from '@app/shared/directives/has-role.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    RouterLink,
    GoToDirective,
    HasRoleDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  @ViewChild('notificationsList', { static: false })
  notificationsList!: ElementRef;

  destroy$ = new Subject<void>();
  page = 1;
  size = 10;
  isLoading = false;
  hasMorePages = true;
  username: string | null = null;

  filterOptions: notifiactionFilterOptions = {
    isRead: false,
    sortBy: 'createdAt',
    sortDirection: 'desc',
  };

  notifications: Notification[] = [];
  swipeStates: {
    [key: string]: {
      isSwipedLeft: boolean;
      translateX: number;
      startX?: number;
      startY?: number;
      isDragging?: boolean;
    };
  } = {};

  constructor(
    private navigationService: NavigationService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.navigationService.configureNavbar(['items', 'movements']);

    this.loadNotifications();
    this.username = 'dwadwd';
  }

  ngAfterViewInit(): void {
    this.setupScrollListener();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupScrollListener(): void {
    if (this.notificationsList) {
      const element = this.notificationsList.nativeElement;

      element.addEventListener('scroll', () => {
        this.onScroll();
      });
    }
  }

  private onScroll(): void {
    const element = this.notificationsList.nativeElement;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;

    if (
      scrollTop + clientHeight >= scrollHeight - 100 &&
      !this.isLoading &&
      this.hasMorePages
    ) {
      this.loadMoreNotifications();
    }
  }

  private loadNotifications(): void {
    this.isLoading = true;
    this.page = 1;

    this.notificationService
      .getUserNotifications(this.page, this.size, this.filterOptions)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.notifications = response.data.content;
          this.hasMorePages = !response.data.last;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading notifications:', error);
          this.isLoading = false;
        },
      });
  }

  private loadMoreNotifications(): void {
    this.isLoading = true;
    this.page++;

    this.notificationService
      .getUserNotifications(this.page, this.size, this.filterOptions)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.notifications = [
            ...this.notifications,
            ...response.data.content,
          ];
          this.hasMorePages = !response.data.last;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading more notifications:', error);
          this.isLoading = false;
        },
      });
  }

  get unreadCount(): number {
    return this.notifications.filter((n) => !n.isRead).length;
  }

  formatTime(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getNotificationIcon(type: string): string {
    const icons = {
      info: 'info',
      success: 'check-circle',
      warning: 'alert-triangle',
      error: 'alert-circle',
    };
    return icons[type as keyof typeof icons] || 'bell';
  }

  onTouchStart(event: TouchEvent, notificationId: number): void {
    const touch = event.touches[0];
    this.swipeStates[notificationId] = {
      ...this.swipeStates[notificationId],
      startX: touch.clientX,
      startY: touch.clientY,
      isDragging: false,
    };
  }

  onTouchMove(event: TouchEvent, notificationId: number): void {
    if (!this.swipeStates[notificationId]) return;

    const touch = event.touches[0];
    const deltaX = touch.clientX - this.swipeStates[notificationId].startX!;
    const deltaY = touch.clientY - this.swipeStates[notificationId].startY!;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      event.preventDefault();
      this.swipeStates[notificationId].isDragging = true;

      const translateX = Math.min(0, deltaX);
      this.swipeStates[notificationId].translateX = translateX;
    }
  }

  onTouchEnd(event: TouchEvent, notificationId: number): void {
    if (
      !this.swipeStates[notificationId] ||
      !this.swipeStates[notificationId].isDragging
    )
      return;

    const translateX = this.swipeStates[notificationId].translateX;

    if (translateX < -100) {
      this.markAsRead(notificationId);
    } else {
      this.swipeStates[notificationId].translateX = 0;
    }

    this.swipeStates[notificationId].isDragging = false;
  }

  getSwipeTransform(notificationId: number): string {
    const state = this.swipeStates[notificationId];
    if (!state) return 'translateX(0)';

    return `translateX(${state.translateX || 0}px)`;
  }

  getSwipeOpacity(notificationId: number): number {
    const state = this.swipeStates[notificationId];
    if (!state) return 1;

    const translateX = Math.abs(state.translateX || 0);
    return Math.max(0.3, 1 - translateX / 200);
  }

  markAsRead(notificationId: number): void {
    const request: MarkReadingNotification = {
      isRead: true,
      id: notificationId,
    };
    this.notificationService
      .markNotificationAsRead(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          const notification = this.notifications.find(
            (n) => n.id === notificationId
          );
          if (notification) {
            notification.isRead = true;
          }

          this.animateNotificationRemoval(notificationId);
        },
        error: (error) => {
          console.error('Error marking notification as read:', error);
          this.swipeStates[notificationId] = {
            isSwipedLeft: false,
            translateX: 0,
          };
        },
      });
  }

  private animateNotificationRemoval(notificationId: number): void {
    this.swipeStates[notificationId] = { isSwipedLeft: true, translateX: -300 };

    setTimeout(() => {
      this.notifications = this.notifications.filter(
        (n) => n.id !== notificationId
      );
      delete this.swipeStates[notificationId];
    }, 300);
  }

  onRefresh(): void {
    this.loadNotifications();
  }

  trackByNotificationId(index: number, notification: Notification): number {
    return notification.id;
  }
}
