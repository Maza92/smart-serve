import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationService } from '@app/core/service/navigation.service';
import { BackBarComponent } from '@app/shared/back-bar/back-bar.component';
import { BasePageComponent } from '@app/shared/base-page/base-page.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [BasePageComponent, LucideAngularModule, CommonModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css',
})
export class InventoryComponent implements OnInit {
  path: string | null = null;

  constructor(private navigationService: NavigationService) {}

  ngOnInit(): void {
    this.path = this.navigationService.getCurrentComponentPath();

    this.navigationService.addExclusions(
      [
        'Inventario',
        'Ajustes',
        'Caja',
        'Reportes',
        'Clientes',
        'Notificaciones',
      ],
      this.path
    );
  }
}
