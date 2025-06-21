import { Component, OnDestroy, OnInit } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { NavigationService } from '../../core/service/navigation.service';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavItem } from '../../core/model/navigation';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [LucideAngularModule, RouterModule, CommonModule],
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.css',
})
export class NavigationBarComponent implements OnInit, OnDestroy {
  navItems: NavItem[] = [];
  private navSubscription: Subscription | undefined;

  constructor(private navigationService: NavigationService) {}

  ngOnInit(): void {
    this.navSubscription = this.navigationService.visibleNavItems$.subscribe(
      (items) => {
        this.navItems = items;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.navSubscription) {
      this.navSubscription.unsubscribe();
    }
  }
}
