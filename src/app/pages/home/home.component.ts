import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
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
