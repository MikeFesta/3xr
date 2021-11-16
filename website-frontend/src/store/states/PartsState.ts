// SPDX-License-Identifier: Apache-2.0
import Part, { PartInterface } from '@/store/interfaces/Part';
import { ActionContext } from 'vuex';
import backend from '@/services/3xrCom';
import { RootState } from '@/store/index';

export interface PartsState {
  parts: PartInterface[];
}

export default {
  namespaced: true as true,
  state: {
    parts: [],
  } as PartsState,
  mutations: {
    LOAD(state: PartsState, parts: Part[]) {
      state.parts = [];
      for (let i = 0; i < parts.length; i++) {
        state.parts.push(new Part(parts[i]));
      }
    },
    CLEAR(state: PartsState) {
      state.parts = [];
    },
  },
  getters: {},
  actions: {
    async loadAllForAdmin({ commit, getters }: ActionContext<PartsState, RootState>) {
      const partSearch = await backend.get('part/search');
      commit('LOAD', partSearch.data);
    },
  },
};
