// SPDX-License-Identifier: Apache-2.0
import Part, { PartInterface } from '@/store/interfaces/Part';
import { ActionContext } from 'vuex';
import backend from '@/services/3xrCom';
import { RootState } from '@/store/index';

export interface PartState {
  part: PartInterface;
}

export default {
  namespaced: true as true,
  state: {
    part: new Part(null),
  } as PartState,
  mutations: {
    LOAD(state: PartState, part: Part) {
      state.part = new Part(part);
    },
    CLEAR(state: PartState) {
      state.part = new Part(null);
    },
  },
  getters: {},
  actions: {
    async loadByUid({ commit, getters }: ActionContext<PartState, RootState>, uid: string) {
      const part = await backend.get('part/details/' + uid);
      commit('LOAD', part.data);
    },
    async refresh({ dispatch, state }: ActionContext<PartState, RootState>) {
      return dispatch('loadByUid', state.part.uid);
    },
  },
};
