import { ACBNotification } from './../notification.service';
import { Action } from '@ngrx/store';

export enum NotificationActionTypes {
  SET_NOTIFICATION = '[Notification] Set Notification',
  SET_NOTIFICATIONS = '[Notification] Set Notifications',
}

export class SetNotification implements Action {
  readonly type = NotificationActionTypes.SET_NOTIFICATION;
  constructor(public payload: ACBNotification) {}
}

export class SetNotifications implements Action {
  readonly type = NotificationActionTypes.SET_NOTIFICATIONS;
  constructor(public payload: ACBNotification[]) {}
}

export type NotificationActions = SetNotification | SetNotifications;
