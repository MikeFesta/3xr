// SPDX-License-Identifier: Apache-2.0
import { ActionContext } from 'vuex';
import { HistoryInterface } from '@/store/interfaces/History';

export interface HistoryState {
  history: Array<HistoryInterface>;
}

export default {
  namespaced: true as true,
  state: {
    history: [],
  } as HistoryState,
  mutations: {
    CLEAR(state: HistoryState) {
      state.history = [];
    },
    SET(state: HistoryState, history: HistoryInterface[]) {
      state.history = history;
    },
    ADD_HISTORY(state: HistoryState, history: HistoryInterface) {
      state.history = state.history.concat(history);
    },
  },
  getters: {},
  actions: {
    addPath({ commit }: ActionContext<HistoryState, HistoryState>, history: HistoryInterface) {
      commit('ADD_HISTORY', history);
    },
  },
};
