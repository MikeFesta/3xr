// SPDX-License-Identifier: Apache-2.0
import { ActionContext } from 'vuex';
import backend from '@/services/3xrCom';
import Studio from '@/store/interfaces/Studio';

export interface StudiosState {
  studios: Array<Studio>;
}

export default {
  namespaced: true as true,
  state: {
    studios: [],
  } as StudiosState,
  mutations: {
    CLEAR(state: StudiosState) {
      state.studios = [];
    },
    SET(state: StudiosState, studios: Array<Studio>) {
      let studiosObject = [];
      if (studios) {
        for (let i = 0; i < studios.length; i++) {
          studiosObject.push(new Studio(studios[i]));
        }
      }
      state.studios = studiosObject;
    },
  },
  getters: {},
  actions: {
    async loadAllForAdmin({ commit }: ActionContext<StudiosState, StudiosState>) {
      const results = await backend.get('admin/studio/search_studios');
      commit('SET', results.data);
    },
    async loadForClient({ commit }: ActionContext<StudiosState, StudiosState>, id: number) {
      const results = await backend.post('client/client_studios', { id: id });
      commit('SET', results.data);
    },
    async loadForUser({ commit }: ActionContext<StudiosState, StudiosState>, id: number) {
      const results = await backend.post('user/studios', { id: id });
      commit('SET', results.data);
    },
  },
};
