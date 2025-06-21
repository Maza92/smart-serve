import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { NavigationService } from '../../core/service/navigation.service';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/core/service/auth.service';
import { GoToDirective } from '@app/shared/directives/go-to.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink, GoToDirective],
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
    this.navigationService.configureNavbar([
      'items',
      'movements',
      'notifications',
    ]);
  }
}
