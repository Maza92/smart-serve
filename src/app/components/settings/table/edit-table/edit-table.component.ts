import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RestaurantTable } from '@app/core/model/data/restaurant-table';
import { UpdateRestaurantTableRequest } from '@app/core/model/restaurant-table/update-restaurant-table-request';
import { RestaurantTableService } from '@app/core/service/restaurant-table.service';
import { ToastService } from '@app/lib/toast/toast.service';
import { LucideAngularModule } from 'lucide-angular';
import { ModalService } from 'ngx-modal-ease';

@Component({
  selector: 'app-edit-table',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
    CommonModule,
  ],
  templateUrl: './edit-table.component.html',
  styleUrl: './edit-table.component.css',
})
export class EditTableComponent implements OnInit {
  tableForm!: FormGroup;
  statusOptions = ['AVAILABLE', 'OCCUPIED', 'RESERVED'];
  tableId: number = 0;
  table?: RestaurantTable;
  data: any;

  constructor(
    private builder: FormBuilder,
    private modalService: ModalService,
    private tableService: RestaurantTableService,
    private toastService: ToastService
  ) {
    this.tableForm = this.builder.group({
      number: ['', [Validators.required, Validators.min(1)]],
      capacity: ['', [Validators.required, Validators.min(1)]],
      status: ['', [Validators.required]],
      section: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.tableId) {
      this.loadTableData();
    } else {
      this.toastService.error('No se pudo cargar la mesa', 'Error');
      this.closeModal();
    }
  }

  loadTableData(): void {
    this.tableService.getTableById(this.tableId).subscribe(
      (response) => {
        this.table = response.data;
        this.tableForm.patchValue({
          number: this.table.number,
          capacity: this.table.capacity,
          status: this.table.status,
          section: this.table.section,
        });
      },
      (error) => {
        this.toastService.error(error.message, 'Error');
        this.closeModal();
      }
    );
  }

  get number() {
    return this.tableForm.get('number');
  }

  get capacity() {
    return this.tableForm.get('capacity');
  }

  get status() {
    return this.tableForm.get('status');
  }

  get section() {
    return this.tableForm.get('section');
  }

  closeModal() {
    this.modalService.close();
  }

  updateTable() {
    if (this.tableForm.invalid) {
      this.toastService.error('Formulario inválido', 'Error');
      return;
    }

    const data: UpdateRestaurantTableRequest = {
      number: this.number?.value,
      capacity: this.capacity?.value,
      status: this.status?.value,
      section: this.section?.value,
    };

    this.tableService.updateTable(data, this.tableId).subscribe(
      (response) => {
        this.toastService.success(response.message, 'Éxito');
        this.modalService.close(true);
      },
      (error) => {
        this.toastService.error(error.message, 'Error');
      }
    );
  }
}
