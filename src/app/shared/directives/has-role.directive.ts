import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { AuthService } from '@app/core/service/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[appHasRole]',
})
export class HasRoleDirective implements OnInit, OnDestroy {
  private requiredRoles: string[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private authService: AuthService
  ) {}

  @Input()
  set appHasRole(roles: string | string[]) {
    this.requiredRoles = Array.isArray(roles) ? roles : [roles];
    this.updateState();
  }

  ngOnInit(): void {
    this.authService
      .getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateState();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateState(): void {
    const userRole = this.authService.getCurrentUserSnapshot()?.roleName;
    const hasPermission = this.requiredRoles.includes(userRole ?? '');

    if (!hasPermission) {
      this.renderer.setProperty(this.el.nativeElement, 'disabled', true);
      this.renderer.addClass(this.el.nativeElement, 'disabled-by-role');
    } else {
      this.renderer.setProperty(this.el.nativeElement, 'disabled', false);
      this.renderer.removeClass(this.el.nativeElement, 'disabled-by-role');
    }
  }
}
