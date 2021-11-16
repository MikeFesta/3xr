// SPDX-License-Identifier: Apache-2.0
import { ActionContext } from 'vuex';
import backend from '@/services/3xrCom';
import ClientBrand from '@/store/interfaces/ClientBrand';

export interface ClientBrandState {
  clientBrands: Array<ClientBrand>;
}

export default {
  namespaced: true as true,
  state: {
    clientBrands: [],
  } as ClientBrandState,
  mutations: {
    CLEAR(state: ClientBrandState) {
      state.clientBrands = [];
    },
    SET(state: ClientBrandState, clientBrands: Array<ClientBrand>) {
      state.clientBrands = clientBrands.map(brand => new ClientBrand(brand));
    },
  },
  getters: {},
  actions: {
    async loadForClient({ commit, state }: ActionContext<ClientBrandState, ClientBrandState>, clientId: number) {
      commit('CLEAR');
      const brands = await backend.post('/client/brand_picklist', { clientId });
      commit('SET', brands.data);
    },
  },
};
