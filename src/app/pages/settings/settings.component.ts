import { Component } from '@angular/core';
import { BackBarComponent } from '../../shared/back-bar/back-bar.component';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '@app/core/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [BackBarComponent, LucideAngularModule],
  templateUrl: './settings.component.html',
  styles: ``,
})
export class SettingsComponent {
  title: string = 'Ajustes';

  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout successful');
        this.router.navigate(['/starter']);
      },
      error: (error) => {
        console.error('Logout failed', error);
      },
    });
  }
}
