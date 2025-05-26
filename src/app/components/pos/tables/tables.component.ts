import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BackBarComponent } from '@app/shared/back-bar/back-bar.component';
import { BasePageComponent } from '@app/shared/base-page/base-page.component';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [BasePageComponent, BackBarComponent, CommonModule],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.css',
})
export class TablesComponent {}
