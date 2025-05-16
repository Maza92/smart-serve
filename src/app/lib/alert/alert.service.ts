import {
  Injectable,
  ComponentRef,
  EnvironmentInjector,
  createComponent,
  ApplicationRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { AlertConfig, AlertEvent } from './interfaces/alert';
import { AlertComponent } from './components/alert/alert.component';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alertComponentRef: ComponentRef<AlertComponent> | null = null;
  private alertEvents = new Subject<AlertEvent>();

  alertEvents$ = this.alertEvents.asObservable();

  constructor(
    private injector: EnvironmentInjector,
    private appRef: ApplicationRef
  ) {
    this.createAlertContainer();
  }

  private createAlertContainer() {
    this.alertComponentRef = createComponent(AlertComponent, {
      environmentInjector: this.injector,
    });

    document.body.appendChild(this.alertComponentRef.location.nativeElement);
    this.appRef.attachView(this.alertComponentRef.hostView);
    this.alertComponentRef.instance.alertEvents$ = this.alertEvents$;
  }

  show(config: AlertConfig) {
    const id = `alert-${Date.now()}`;

    const defaultConfig: AlertConfig = {
      title: '',
      type: 'info',
      showCloseButton: true,
      buttons: [],
      ...config,
    };

    this.alertEvents.next({ id, config: defaultConfig });

    return id;
  }

  info(message: string, title?: string, config?: Partial<AlertConfig>) {
    return this.show({
      message,
      title,
      type: 'info',
      ...config,
    });
  }

  success(message: string, title?: string, config?: Partial<AlertConfig>) {
    return this.show({
      message,
      title,
      type: 'success',
      ...config,
    });
  }

  warning(message: string, title?: string, config?: Partial<AlertConfig>) {
    return this.show({
      message,
      title,
      type: 'warning',
      ...config,
    });
  }

  error(message: string, title?: string, config?: Partial<AlertConfig>) {
    return this.show({
      message,
      title,
      type: 'error',
      ...config,
    });
  }

  confirm(
    message: string,
    title?: string,
    onConfirm?: () => void,
    onCancel?: () => void
  ) {
    return this.show({
      message,
      title: title || 'Confirma',
      type: 'warning',
      buttons: [
        {
          text: 'Cancelar',
          type: 'secondary',
          action: () => {
            if (onCancel) onCancel();
          },
        },
        {
          text: 'Confirmar',
          type: 'primary',
          action: () => {
            if (onConfirm) onConfirm();
          },
        },
      ],
    });
  }

  close(id?: string) {
    if (id) {
      this.alertEvents.next({ id, config: { message: '' } });
    } else {
      this.alertEvents.next({ id: 'close-all', config: { message: '' } });
    }
  }
}
