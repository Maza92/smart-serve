import { Component } from '@angular/core';
import { BackBarComponent } from '@app/shared/back-bar/back-bar.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [BackBarComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {}
