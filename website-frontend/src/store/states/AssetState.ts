// SPDX-License-Identifier: Apache-2.0
import { ActionContext } from 'vuex';
import Asset, { AssetInterface } from '@/store/interfaces/Asset';
import backend from '@/services/3xrCom';

export interface AssetState {
  asset: AssetInterface;
}

export default {
  namespaced: true as true,
  state: {
    asset: new Asset(null),
  } as AssetState,
  mutations: {
    CLEAR(state: AssetState) {
      state.asset = new Asset(null);
    },
    SET(state: AssetState, asset: Asset) {
      state.asset = new Asset(asset);
    },
  },
  getters: {},
  actions: {
    fetchByUid({ commit, state }: ActionContext<AssetState, AssetState>, uid: string) {
      // Note: this function is not currently in use because the QA Review tab disappears on asset/details page
      if (state.asset.uid != uid) {
        commit('CLEAR');
      }
      return backend
        .post('/asset/asset_details/', { uid })
        .then(result => {
          commit('SET', result.data);
        })
        .catch(err => {
          throw err;
        });
    },
    fetchByUidWithSubmissions({ commit, state }: ActionContext<AssetState, AssetState>, uid: string) {
      if (state.asset.uid != uid) {
        commit('CLEAR');
      }
      return backend
        .post('/asset/asset_details_with_submissions', { uid })
        .then(result => {
          commit('SET', result.data);
        })
        .catch(err => {
          throw err;
        });
    },
    refresh({ state, dispatch }: ActionContext<AssetState, AssetState>) {
      return dispatch('fetchByUidWithSubmissions', state.asset.uid);
    },
  },
};
