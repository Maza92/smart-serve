export interface Notification {
  id: number;
  message: string;
  type: NotificationtypeEnum;
  isRead: boolean;
  relatedEntityType: string;
  relatedEntityId: number;
  userId: number;
  userName: number;
}

export interface MarkReadingNotification {
  id: number;
  isRead: boolean;
}

export enum NotificationtypeEnum {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}
