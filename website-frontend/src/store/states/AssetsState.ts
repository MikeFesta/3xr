// SPDX-License-Identifier: Apache-2.0
import Asset, { AssetInterface } from '@/store/interfaces/Asset';
import { ActionContext } from 'vuex';
import backend from '@/services/3xrCom';
import { RootState } from '@/store';

export interface AssetsState {
  assets: AssetInterface[];
}

export default {
  namespaced: true as true,
  state: {
    assets: [],
  } as AssetsState,
  mutations: {
    LOAD(state: AssetsState, assets: Asset[]) {
      state.assets = [];
      for (let i = 0; i < assets.length; i++) {
        state.assets.push(new Asset(assets[i]));
      }
    },
    CLEAR(state: AssetsState) {
      state.assets = [];
    },
  },
  getters: {},
  actions: {
    async loadAllForAdmin({ commit, getters }: ActionContext<AssetsState, RootState>) {
      const search = await backend.post('asset/search');
      commit('LOAD', search.data);
    },
  },
};
