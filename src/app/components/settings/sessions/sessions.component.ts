import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActiveSession, Session } from '@app/core/model/auth/active-session';
import { AuthService } from '@app/core/service/auth.service';
import { BackBarComponent } from '@app/shared/back-bar/back-bar.component';
import { LucideAngularModule } from 'lucide-angular';
import { finalize, Subject, takeUntil } from 'rxjs';
import { ToastService } from '@app/lib/toast/toast.service';

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, BackBarComponent],
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.css',
})
export class SessionsComponent implements OnInit, OnDestroy {
  activeSession: ActiveSession | null = null;
  loading = false;
  revoking = false;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadActiveSessions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadActiveSessions(): void {
    if (this.loading) return;

    this.loading = true;

    this.authService
      .getActiveSessions()
      .pipe(
        finalize(() => (this.loading = false)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          this.activeSession = response;
        },
        error: (error) => {
          this.toastService.error(
            'Error',
            'No se pudieron cargar las sesiones activas',
            {
              position: 'top-center',
              showCloseButton: false,
              showProgressBar: false,
              duration: 3000,
            }
          );
          console.error('Error loading sessions:', error);
        },
      });
  }

  revokeSession(sessionId: number): void {
    if (this.revoking) return;

    this.revoking = true;

    this.authService
      .revokeSession(sessionId)
      .pipe(
        finalize(() => (this.revoking = false)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          this.toastService.success('Éxito', 'Sesión revocada correctamente', {
            position: 'top-center',
            showCloseButton: false,
            showProgressBar: false,
            duration: 3000,
          });
          this.loadActiveSessions();
        },
        error: (error) => {
          this.toastService.error('Error', 'No se pudo revocar la sesión', {
            position: 'top-center',
            showCloseButton: false,
            showProgressBar: false,
            duration: 3000,
          });
          console.error('Error revoking session:', error);
        },
      });
  }

  revokeAllSessions(): void {
    if (this.revoking) return;

    this.revoking = true;

    this.authService
      .revokeAllSessions()
      .pipe(
        finalize(() => (this.revoking = false)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          this.toastService.success(
            'Éxito',
            'Todas las sesiones han sido revocadas',
            {
              position: 'top-center',
              showCloseButton: false,
              showProgressBar: false,
              duration: 3000,
            }
          );
          this.loadActiveSessions();
        },
        error: (error) => {
          this.toastService.error(
            'Error',
            'No se pudieron revocar todas las sesiones',
            {
              position: 'top-center',
              showCloseButton: false,
              showProgressBar: false,
              duration: 3000,
            }
          );
          console.error('Error revoking all sessions:', error);
        },
      });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  isSessionExpired(expiryString: string): boolean {
    const expiry = new Date(expiryString);
    return expiry < new Date();
  }
}
