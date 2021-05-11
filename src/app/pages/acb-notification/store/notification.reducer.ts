import { ACBNotification } from './../notification.service';
import * as NotificationActions from './notification.actions';
import * as fromRoot from '../../../app.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface NotificationState {
  notification: ACBNotification;
  notifications: ACBNotification[];
}
//Our App State does not know about training state
//but training state knows about app state
//ngrx will behind the scene merge both states
//whenever this module is loaded lazily
export interface State extends fromRoot.State {
  notification: NotificationState;
}

const initialState: NotificationState = {
  notification: null,
  notifications: [],
};

export function notificationReducer(
  state = initialState,
  action: NotificationActions.NotificationActions
) {
  switch (action.type) {
    case NotificationActions.NotificationActionTypes.SET_NOTIFICATION:
      return {
        ...state,
        notification: action.payload,
      };
    case NotificationActions.NotificationActionTypes.SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
      };
    default:
      return state;
  }
}

export const getNotificationState = createFeatureSelector<NotificationState>(
  'notification'
);
export const getNotification = createSelector(
  getNotificationState,
  (state: NotificationState) => state.notification
);
export const getNotifications = createSelector(
  getNotificationState,
  (state: NotificationState) => state.notifications
);
