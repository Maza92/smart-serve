import { Component } from '@angular/core';
import { BackBarComponent } from '../../shared/back-bar/back-bar.component';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '@app/core/service/auth.service';
import { Router } from '@angular/router';
import { GoToDirective } from '@app/shared/directives/go-to.directive';
import { WebSocketService } from '@app/core/service/websocket.service';
import { HasRoleDirective } from '@app/shared/directives/has-role.directive';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    BackBarComponent,
    LucideAngularModule,
    GoToDirective,
    HasRoleDirective,
  ],
  templateUrl: './settings.component.html',
  styles: ``,
})
export class SettingsComponent {
  title: string = 'Ajustes';

  constructor(
    private authService: AuthService,
    private router: Router,
    private webSocketService: WebSocketService
  ) {}

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout successful');
        this.webSocketService.disconnect();
        this.router.navigate(['/starter']);
      },
      error: (error) => {
        console.error('Logout failed', error);
      },
    });
  }
}
