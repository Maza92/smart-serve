import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalService } from 'ngx-modal-ease';

@Component({
  selector: 'app-modal-content',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ title }}</h2>
        <button (click)="closeModal()">X</button>
      </div>
      <div class="modal-body">
        <p>{{ message }}</p>
        <input type="text" [(ngModel)]="inputData" placeholder="Escribe algo" />
      </div>
      <div class="modal-footer">
        <button (click)="saveModal()">Guardar</button>
      </div>
    </div>
  `,
  styles: [
    `
      .modal-content {
        background: #fff;
        border-radius: 22px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }
      .modal-header {
        padding: 1rem;
        background: #007bff;
        border-radius: 22px 22px 0 0;
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .modal-body {
        padding: 1rem;
      }
      .modal-footer {
        padding: 1rem;
        text-align: right;
      }
      button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .modal-header button {
        background: transparent;
        color: white;
        font-weight: bold;
      }
      .modal-footer button {
        background: #007bff;
        color: white;
      }
    `,
  ],
})
export class ModalContentComponent {
  @Input() title: string = '';
  @Input() message: string = '';
  inputData: string = '';

  constructor(private modalService: ModalService) {}

  closeModal() {
    this.modalService.close(null); // Cierra el modal sin datos
  }

  saveModal() {
    this.modalService.close(this.inputData); // Cierra el modal y retorna el valor del input
  }
}
