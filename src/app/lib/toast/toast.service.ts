import {
  Injectable,
  ComponentRef,
  EnvironmentInjector,
  createComponent,
  ApplicationRef,
  Type,
} from '@angular/core';
import { Subject } from 'rxjs';
import { ToastAction, ToastConfig, ToastEvent } from './interfaces/toast';
import { ToastComponentComponent } from './components/toast-component/toast-component.component';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastComponentRef: ComponentRef<ToastComponentComponent> | null =
    null;
  private toastEvents = new Subject<ToastEvent>();

  toastEvents$ = this.toastEvents.asObservable();

  constructor(
    private injector: EnvironmentInjector,
    private appRef: ApplicationRef
  ) {
    this.createToastContainer();
  }

  private createToastContainer() {
    this.toastComponentRef = createComponent(ToastComponentComponent, {
      environmentInjector: this.injector,
    });

    document.body.appendChild(this.toastComponentRef.location.nativeElement);
    this.appRef.attachView(this.toastComponentRef.hostView);
    this.toastComponentRef.instance.toastEvents$ = this.toastEvents$;
  }

  show(config: ToastConfig) {
    const id = `toast-${Date.now()}`;

    const defaultConfig: ToastConfig = {
      title: '',
      type: 'info',
      duration: 3000,
      position: 'top-center',
      showCloseButton: false,
      showProgressBar: false,
      actions: [],
      ...config,
    };

    this.toastEvents.next({ id, config: defaultConfig });

    return id;
  }

  info(message: string, title?: string, config?: Partial<ToastConfig>) {
    return this.show({
      message,
      title,
      type: 'info',
      ...config,
    });
  }

  success(message: string, title?: string, config?: Partial<ToastConfig>) {
    return this.show({
      message,
      title,
      type: 'success',
      ...config,
    });
  }

  warning(message: string, title?: string, config?: Partial<ToastConfig>) {
    return this.show({
      message,
      title,
      type: 'warning',
      ...config,
    });
  }

  error(message: string, title?: string, config?: Partial<ToastConfig>) {
    return this.show({
      message,
      title,
      type: 'error',
      ...config,
    });
  }

  clear(id?: string) {
    if (id) {
      this.toastEvents.next({
        id,
        config: { message: '', type: 'info', duration: 0 },
      });
    } else {
      this.toastEvents.next({
        id: 'clear-all',
        config: { message: '', type: 'info', duration: 0 },
      });
    }
  }
}
