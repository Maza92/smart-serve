import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationBarComponent } from '../../shared/navitagion-bar/navitagion-bar.component';

@Component({
  selector: 'app-navigation-bar-layout',
  standalone: true,
  imports: [RouterOutlet, NavigationBarComponent],
  templateUrl: './navigation-bar-layout.component.html',
  styleUrl: './navigation-bar-layout.component.css',
})
export class NavigationBarLayoutComponent {}
