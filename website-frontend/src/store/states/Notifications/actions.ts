// SPDX-License-Identifier: Apache-2.0
import { ActionContext } from 'vuex';
import store, { RootState } from '@/store';
import backend from '@/services/3xrCom';
import { NotificationsState } from './interfaces';

const actions = {
  async fetchNotifications({ commit }: ActionContext<NotificationsState, RootState>) {
    if (store.getters.user.authenticated) {
      const response = await backend.get('user/notifications');
      commit('SET', response.data);
    }
  },
  async markNotificationRead({ dispatch }: ActionContext<NotificationsState, RootState>, id: string) {
    await backend.post(`user/notifications/mark_read/${id}`);
    return dispatch('fetchNotifications');
  },
  async clearAll({ dispatch }: ActionContext<NotificationsState, RootState>) {
    await backend.post(`user/notifications/clear_all`);
    return dispatch('fetchNotifications');
  },
  async markAllRead({ dispatch }: ActionContext<NotificationsState, RootState>) {
    await backend.post(`user/notifications/mark_all_read`);
    return dispatch('fetchNotifications');
  },
  async deleteNotification({ dispatch }: ActionContext<NotificationsState, RootState>, id: String) {
    await backend.post(`user/notifications/delete/${id}`);
    return dispatch('fetchNotifications');
  },
};

export default actions;
