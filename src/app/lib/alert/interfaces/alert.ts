export interface AlertConfig {
  title?: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  showCloseButton?: boolean;
  buttons?: AlertButton[];
}

export interface AlertButton {
  text: string;
  type?: 'primary' | 'secondary' | 'danger';
  action: () => void;
}

export interface AlertEvent {
  id: string;
  config: AlertConfig;
}

export interface AlertItem {
  id: string;
  config: AlertConfig;
}
