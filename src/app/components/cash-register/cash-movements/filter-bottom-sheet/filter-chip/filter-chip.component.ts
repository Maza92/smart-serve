import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChipFilter } from '@app/core/model/filter-options';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-filter-chip',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './filter-chip.component.html',
  styleUrls: ['./filter-chip.component.css']
})
export class FilterChipComponent {
  @Input() filter!: ChipFilter;
  @Output() remove = new EventEmitter<ChipFilter>();

  onRemove(): void {
    this.remove.emit(this.filter);
  }
}