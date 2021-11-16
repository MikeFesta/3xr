// SPDX-License-Identifier: Apache-2.0
import actions from './actions';
import getters from './getters';
import { NotificationsState, NotificationInterface } from './interfaces';

export default {
  namespaced: true as true,
  state: {
    notifications: [],
  } as NotificationsState,
  mutations: {
    CLEAR(state: NotificationsState) {
      state.notifications = [];
    },
    SET(state: NotificationsState, notifications: NotificationInterface[]) {
      state.notifications = notifications;
    },
    ADD_NOTIFICATIONS(state: NotificationsState, notification: NotificationInterface[] | NotificationInterface) {
      state.notifications = state.notifications.concat(notification);
    },
  },
  getters,
  actions,
};
