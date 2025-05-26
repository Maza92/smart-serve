import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BackBarComponent } from '@app/shared/back-bar/back-bar.component';
import { BasePageComponent } from '@app/shared/base-page/base-page.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    BackBarComponent,
    BasePageComponent,
    LucideAngularModule,
    CommonModule,
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css',
})
export class InventoryComponent {}
