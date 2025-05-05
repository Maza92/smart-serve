import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { NavigationService } from '../../core/service/navigation.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private path: string | null = null;
  constructor(private navigationService: NavigationService) {}

  ngOnInit(): void {
    this.path = this.navigationService.getCurrentComponentPath();

    this.navigationService.addExclusion('Home', this.path);
    this.navigationService.addExclusion('Inventario', this.path);
    this.navigationService.addExclusion('Ajustes', this.path);
    this.navigationService.addExclusion('Caja', this.path);
    this.navigationService.addExclusion('Reportes', this.path);

    this.navigationService.updateNavVisibility(this.path);
  }

  sections: any = [
    {
      icon: 'square-check',
      text: 'Inventario',
      background: 'primary',
      color: 'background',
    },
    {
      icon: 'dollar-sign',
      text: 'Caja',
      background: 'background',
      color: 'primary',
    },
    {
      icon: 'chart-no-axes-column-increasing',
      text: 'Reportes',
      background: 'background',
      color: 'primary',
    },
    {
      icon: 'settings',
      text: 'Ajustes',
      background: 'primary',
      color: 'background',
    },
  ];
}
