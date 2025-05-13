import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { NavigationService } from '../../core/service/navigation.service';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/core/service/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private path: string | null = null;
  username: string | null = null;

  public notificationTest = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  constructor(
    private navigationService: NavigationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.path = this.navigationService.getCurrentComponentPath();
    this.username = this.authService.getUserName();

    this.navigationService.addExclusion('Home', this.path);
    this.navigationService.addExclusion('Inventario', this.path);
    this.navigationService.addExclusion('Ajustes', this.path);
    this.navigationService.addExclusion('Caja', this.path);
    this.navigationService.addExclusion('Reportes', this.path);

    this.navigationService.updateNavVisibility(this.path);
  }
}
