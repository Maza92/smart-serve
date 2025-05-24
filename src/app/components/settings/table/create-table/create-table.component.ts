import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CreateRestaurantTableRequest } from '@app/core/model/restaurant-table/create-restaurant-table-request';
import { RestaurantTableService } from '@app/core/service/restaurant-table.service';
import { ToastService } from '@app/lib/toast/toast.service';
import { LucideAngularModule } from 'lucide-angular';
import { ModalService } from 'ngx-modal-ease';

@Component({
  selector: 'app-create-table',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
    CommonModule,
  ],
  templateUrl: './create-table.component.html',
  styleUrl: './create-table.component.css',
})
export class CreateTableComponent {
  tableForm!: FormGroup;
  statusOptions = ['AVAILABLE', 'OCCUPIED', 'RESERVED'];

  constructor(
    private builder: FormBuilder,
    private modalService: ModalService,
    private tableService: RestaurantTableService,
    private toastService: ToastService
  ) {
    this.tableForm = this.builder.group({
      number: ['', [Validators.required, Validators.min(1)]],
      capacity: ['', [Validators.required, Validators.min(1)]],
      status: ['AVAILABLE', [Validators.required]],
      section: ['', [Validators.required]],
    });
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

  createTable() {
    if (this.tableForm.invalid) {
      this.toastService.error('Formulario inválido', 'Error');
      return;
    }

    const data: CreateRestaurantTableRequest = {
      id: 0,
      number: this.number?.value,
      capacity: this.capacity?.value,
      status: this.status?.value,
      section: this.section?.value,
    };

    this.tableService.createTable(data).subscribe(
      (response) => {
        this.toastService.success(response.message, 'Éxito');
        this.tableForm.reset();
        this.modalService.close(true);
      },
      (error) => {
        this.toastService.error(error.message, 'Error');
      }
    );
  }
}
