// SPDX-License-Identifier: Apache-2.0
import { ClientBrandInterface, INewBrandRequest, INewClassRequest } from '@/store/interfaces/ClientBrand';
import { ClientClassInterface } from '@/store/interfaces/ClientClass';
import Client, { ClientInterface } from '@/store/interfaces/Client';
import { ActionContext } from 'vuex';
import backend from '@/services/3xrCom';
import { RootState } from '@/store/index';

export interface ClientState {
  client: ClientInterface;
}

export default {
  namespaced: true as true,
  state: {
    client: new Client(null),
  } as ClientState,
  mutations: {
    CLEAR(state: ClientState) {
      state.client = new Client(null);
    },
    SET(state: ClientState, client: ClientInterface) {
      state.client = new Client(client);
    },
    SET_BRANDS(state: ClientState, brands: Array<ClientBrandInterface>) {
      state.client.setBrands(brands);
    },
    SET_CLASSES(state: ClientState, classes: Array<ClientClassInterface>) {
      state.client.setClasses(classes);
    },
  },
  getters: {},
  actions: {
    async fetchClient({ commit }: ActionContext<ClientState, RootState>) {
      const { data } = await backend.get('user/client');
      commit('SET', data);
    },
    async addBrand({ commit }: ActionContext<ClientState, RootState>, brand: INewBrandRequest) {
      const result = await backend.post('client/new_brand', brand);
      commit('SET_BRANDS', result.data);
      return result.data;
    },
    async addClass({ commit }: ActionContext<ClientState, RootState>, brand: INewClassRequest) {
      const result = await backend.post('client/new_class', brand);
      commit('SET_CLASSES', result.data);
      return result.data;
    },
    async getDetailsById({ commit }: ActionContext<ClientState, RootState>, id: number) {
      const { data } = await backend.post('client/details', { id });
      commit('SET', data);
    },
    async getDetailsByUid({ commit }: ActionContext<ClientState, RootState>, uid: string) {
      const { data } = await backend.post('admin/client/client_details', { uid });
      commit('SET', data);
    },
  },
};
