import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseFilterOptions } from '@app/core/model/filter-options';
import { LucideAngularModule } from 'lucide-angular';
import { ModalService } from 'ngx-modal-ease';

@Component({
  selector: 'app-filter-bottom-sheet',
  standalone: true,
  imports: [FormsModule, LucideAngularModule, CommonModule],
  templateUrl: './filter-bottom-sheet.component.html',
  styleUrl: './filter-bottom-sheet.component.css',
})
export class FilterBottomSheetComponent implements OnInit {
  @Input() currentFilters!: BaseFilterOptions;

  tempFilters!: BaseFilterOptions;

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.tempFilters = JSON.parse(JSON.stringify(this.currentFilters));
  }

  closeModal(apply: boolean = false): void {
    if (apply) {
      this.modalService.close(this.tempFilters);
    } else {
      this.modalService.close(null);
    }
  }

  clearFilters(): void {
    this.tempFilters = {
      status: null,
      sortBy: 'name',
      sortDirection: 'asc',
    };
  }
}
