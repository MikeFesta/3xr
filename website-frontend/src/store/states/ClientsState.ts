// SPDX-License-Identifier: Apache-2.0
import { ActionContext } from 'vuex';
import backend from '@/services/3xrCom';
import Client from '@/store/interfaces/Client';

export interface ClientsState {
  clients: Array<Client>;
}

export default {
  namespaced: true as true,
  state: {
    clients: [],
  } as ClientsState,
  mutations: {
    CLEAR(state: ClientsState) {
      state.clients = [];
    },
    SET(state: ClientsState, clients: Array<Client>) {
      let clientsObject = [];
      if (clients) {
        for (let i = 0; i < clients.length; i++) {
          clientsObject.push(new Client(clients[i]));
        }
      }
      state.clients = clientsObject;
    },
  },
  getters: {},
  actions: {
    async loadPicklistForAdmin({ commit }: ActionContext<ClientsState, ClientsState>) {
      commit('CLEAR');
      const results = await backend.get('/admin/client/client_picklist');
      commit('SET', results.data);
    },
    async loadAllForAdmin({ commit }: ActionContext<ClientsState, ClientsState>) {
      commit('CLEAR');
      const results = await backend.get('admin/client/search');
      commit('SET', results.data);
    },
    async loadForUser({ commit }: ActionContext<ClientsState, ClientsState>, id: number) {
      commit('CLEAR');
      const results = await backend.post('user/clients', { id: id });
      commit('SET', results.data);
    },
  },
};
