// SPDX-License-Identifier: Apache-2.0
import { ActionContext } from 'vuex';
import backend from '@/services/3xrCom';
import ClientClass from '@/store/interfaces/ClientClass';

export interface ClientClassState {
  clientClasses: Array<ClientClass>;
}

export default {
  namespaced: true as true,
  state: {
    clientClasses: [],
  } as ClientClassState,
  mutations: {
    CLEAR(state: ClientClassState) {
      state.clientClasses = [];
    },
    SET(state: ClientClassState, clientClasses: Array<ClientClass>) {
      state.clientClasses = clientClasses.map(brand => new ClientClass(brand));
    },
  },
  getters: {},
  actions: {
    async loadForClient({ commit, state }: ActionContext<ClientClassState, ClientClassState>, clientId: number) {
      commit('CLEAR');
      const brands = await backend.post('/client/class_picklist', { clientId });
      commit('SET', brands.data);
    },
  },
};
