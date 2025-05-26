import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationService } from '@app/core/service/navigation.service';
import { BackBarComponent } from '@app/shared/back-bar/back-bar.component';
import { BasePageComponent } from '@app/shared/base-page/base-page.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [
    BasePageComponent,
    BackBarComponent,
    CommonModule,
    LucideAngularModule,
  ],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css',
})
export class SalesComponent implements OnInit {
  tables = [
    { id: 1, selected: false },
    { id: 2, selected: false },
    { id: 3, selected: false },
    { id: 4, selected: false },
    { id: 5, selected: false },
    { id: 6, selected: false },
    { id: 7, selected: false },
    { id: 8, selected: false },
    { id: 9, selected: false },
    { id: 10, selected: false },
  ];
  path: string | null = null;

  constructor(private navigationService: NavigationService) {}

  ngOnInit(): void {
    this.path = this.navigationService.getCurrentComponentPath();
    this.navigationService.addExclusions(
      ['Pos', 'Caja', 'Reportes', 'Clientes', 'Proveedores', 'Notificaciones'],
      this.path
    );
  }

  selectTable(id: number) {
    this.tables.forEach((table) => {
      if (table.id === id) {
        table.selected = !table.selected;
      }
    });
  }
}
