import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from 'ngx-modal-ease';

@Component({
  selector: 'app-option-select',
  standalone: true,
  template: `
    <main
      class="bg-white p-6 rounded-2xl flex flex-col [&>button]:w-full gap-2"
    >
      <h1 class="text-2xl font-bold">Tipo de movimiento</h1>
      <p class="text-sm font-light text-gray-500 mb-4">
        Seleccione el tipo de movimiento que desea realizar
      </p>

      <button
        (click)="goTo('/home/inventory/movements/shop')"
        class="button button-outline button-lg"
      >
        Registrar entrada por compra
      </button>
      <button
        (click)="goTo('/home/inventory/movements/waste')"
        class="button button-outline button-lg"
      >
        Registrar Merma o desperdicio
      </button>
      <button
        (click)="goTo('/home/inventory/movements/manual')"
        class="button button-outline button-lg"
      >
        Realizar ajuste manual
      </button>
    </main>
  `,
})
export class OptionSelectComponent {
  constructor(private modalService: ModalService, private router: Router) {}

  goTo(path: string) {
    this.modalService.closeAll();
    this.router.navigateByUrl(path);
  }
}
