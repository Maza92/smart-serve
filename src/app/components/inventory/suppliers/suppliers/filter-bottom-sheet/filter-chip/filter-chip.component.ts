import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChipFilter } from '@app/core/model/filter-options';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-filter-chip',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './filter-chip.component.html',
  styleUrl: './filter-chip.component.css',
})
export class FilterChipComponent {
  @Input() filter!: ChipFilter;
  @Output() remove = new EventEmitter<ChipFilter>();

  removeFilter(): void {
    this.remove.emit(this.filter);
  }
}
