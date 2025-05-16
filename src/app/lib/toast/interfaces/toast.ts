export interface ToastConfig {
  message: string;
  title?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  position?:
    | 'top-right'
    | 'top-center'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-center'
    | 'bottom-left'
    | 'center-center';
  showCloseButton?: boolean;
  showProgressBar?: boolean;
  actions?: ToastAction[];
}

export interface ToastAction {
  icon?: string;
  text?: string;
  action: () => void;
}

export interface ToastEvent {
  id: string;
  config: ToastConfig;
}

export interface ToastItem {
  id: string;
  config: ToastConfig;
  timeoutId?: number;
}
