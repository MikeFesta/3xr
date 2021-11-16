// SPDX-License-Identifier: Apache-2.0
import Studio, { StudioInterface } from '@/store/interfaces/Studio';
import { ActionContext } from 'vuex';
import backend from '@/services/3xrCom';
import { RootState } from '@/store/index';

export interface StudioState {
  client: StudioInterface;
}

export default {
  namespaced: true as true,
  state: {
    client: new Studio(null),
  } as StudioState,
  mutations: {
    CLEAR(state: StudioState) {
      state.client = new Studio(null);
    },
    SET(state: StudioState, client: StudioInterface) {
      state.client = new Studio(client);
    },
  },
  getters: {},
  actions: {
    async getDetailsById({ commit }: ActionContext<StudioState, RootState>, id: number) {
      const { data } = await backend.post('studio/details', { id });
      commit('SET', data);
    },
  },
};
