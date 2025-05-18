import { Component } from '@angular/core';
import { ToastService } from './toast/toast.service';
import { AlertService } from './alert/alert.service';

@Component({
  selector: 'app-demo',
  standalone: true,
  template: `
    <div class="p-4">
      <h2 class="text-2xl font-bold mb-6">Demostración de Notificaciones</h2>

      <div class="mb-8">
        <h3 class="text-xl font-semibold mb-4">Toasts</h3>
        <div class="flex flex-wrap gap-4">
          <button
            (click)="showInfoToast()"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Info Toast
          </button>
          <button
            (click)="showSuccessToast()"
            class="px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            Success Toast
          </button>
          <button
            (click)="showWarningToast()"
            class="px-4 py-2 bg-yellow-500 text-white rounded-lg"
          >
            Warning Toast
          </button>
          <button
            (click)="showErrorToast()"
            class="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Error Toast
          </button>
          <button
            (click)="showCustomToast()"
            class="px-4 py-2 bg-purple-500 text-white rounded-lg"
          >
            Custom Toast
          </button>
        </div>
      </div>

      <div class="mb-8">
        <h3 class="text-xl font-semibold mb-4">Alertas</h3>
        <div class="flex flex-wrap gap-4">
          <button
            (click)="showInfoAlert()"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Info Alert
          </button>
          <button
            (click)="showSuccessAlert()"
            class="px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            Success Alert
          </button>
          <button
            (click)="showWarningAlert()"
            class="px-4 py-2 bg-yellow-500 text-white rounded-lg"
          >
            Warning Alert
          </button>
          <button
            (click)="showErrorAlert()"
            class="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Error Alert
          </button>
          <button
            (click)="showConfirmAlert()"
            class="px-4 py-2 bg-purple-500 text-white rounded-lg"
          >
            Confirm Alert
          </button>
        </div>
      </div>
    </div>
  `,
})
export class DemoComponent {
  constructor(
    private toastService: ToastService,
    private alertService: AlertService
  ) {}

  // Toast examples
  showInfoToast() {
    this.toastService.info(
      'Esta es una notificación informativa',
      'Información'
    );
  }

  showSuccessToast() {
    this.toastService.success('La operación se completó con éxito', '¡Éxito!', {
      position: 'center-center',
    });
  }

  showWarningToast() {
    this.toastService.warning('Debes prestar atención a esto', 'Advertencia');
  }

  showErrorToast() {
    this.toastService.error(
      'Ha ocurrido un error al procesar la solicitud',
      'Error'
    );
  }

  showCustomToast() {
    this.toastService.show({
      message: 'Personaliza este toast como desees',
      title: 'Custom Toast',
      type: 'success',
      duration: 5000,
      position: 'center-center',
      showProgressBar: true,
      actions: [
        {
          icon: 'x',
          action: () => console.log('Cancelado'),
        },
        {
          icon: 'check',
          action: () => console.log('Aceptado'),
        },
      ],
    });
  }

  // Alert examples
  showInfoAlert() {
    this.alertService.info(
      'Esta es una alerta informativa para el usuario.',
      'Información',
      {
        showCloseButton: false,
      }
    );
  }

  showSuccessAlert() {
    this.alertService.success(
      'La operación se ha completado correctamente.',
      '¡Éxito!'
    );
  }

  showWarningAlert() {
    this.alertService.warning(
      'Tenga cuidado al realizar esta acción.',
      'Advertencia'
    );
  }

  showErrorAlert() {
    this.alertService.error(
      'Ha ocurrido un error al procesar su solicitud.',
      'Error'
    );
  }

  showConfirmAlert() {
    this.alertService.confirm(
      '¿Estás seguro de que deseas eliminar este elemento?',
      'Confirmar eliminación',
      () => {
        this.toastService.success('Elemento eliminado correctamente');
      },
      () => {
        this.toastService.info('Operación cancelada');
      }
    );
  }
}
