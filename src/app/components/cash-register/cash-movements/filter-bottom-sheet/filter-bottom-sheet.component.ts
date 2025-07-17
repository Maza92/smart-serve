import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CashMovementTypeEnum } from '@app/core/enums/cash-movement-enums';
import { CashMovementFilterOptions } from '@app/core/model/filter-options';
import { LucideAngularModule } from 'lucide-angular';
import { ModalService } from 'ngx-modal-ease';

@Component({
  selector: 'app-filter-bottom-sheet',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './filter-bottom-sheet.component.html',
  styleUrls: ['./filter-bottom-sheet.component.css'],
})
export class FilterBottomSheetComponent implements OnInit {
  filters: CashMovementFilterOptions = {
    startDate: undefined,
    endDate: undefined,
    movementType: undefined,
    sortBy: 'movementDate',
    sortDirection: 'desc',
  };

  movementTypes = [
    { value: undefined, label: 'Todos' },
    { value: CashMovementTypeEnum.INCOME, label: 'Ingresos' },
    { value: CashMovementTypeEnum.EXPENSE, label: 'Egresos' },
    {
      value: CashMovementTypeEnum.ADJUSTMENT_INCOME,
      label: 'Ajuste de Ingreso',
    },
    {
      value: CashMovementTypeEnum.ADJUSTMENT_EXPENSE,
      label: 'Ajuste de Egreso',
    },
    { value: CashMovementTypeEnum.SALE, label: 'Venta' },
    { value: CashMovementTypeEnum.REFUND, label: 'Reembolso' },
  ];

  sortOptions = [
    { value: 'movementDate', label: 'Fecha' },
    { value: 'amount', label: 'Monto' },
    { value: 'username', label: 'Usuario' },
  ];

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    if (this.filters.startDate && typeof this.filters.startDate === 'string') {
      this.filters.startDate = new Date(this.filters.startDate);
    }

    if (this.filters.endDate && typeof this.filters.endDate === 'string') {
      this.filters.endDate = new Date(this.filters.endDate);
    }
  }

  clearFilters(): void {
    this.filters = {
      startDate: undefined,
      endDate: undefined,
      movementType: undefined,
      sortBy: 'movementDate',
      sortDirection: 'desc',
    };
  }

  applyFilters(): void {
    this.modalService.close(this.filters);
  }

  cancel(): void {
    this.modalService.close(null);
  }
}
