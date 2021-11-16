// SPDX-License-Identifier: Apache-2.0
import { ActionContext } from 'vuex';
import AssetSubmission, { AssetSubmissionInterface } from '@/store/interfaces/AssetSubmission';
import backend from '@/services/3xrCom';

export interface AssetSubmissionState {
  assetSubmission: AssetSubmissionInterface;
}

export default {
  namespaced: true as true,
  state: {
    assetSubmission: new AssetSubmission(null),
  } as AssetSubmissionState,
  mutations: {
    CLEAR(state: AssetSubmissionState) {
      state.assetSubmission = new AssetSubmission(null);
    },
    SET(state: AssetSubmissionState, assetSubmission: AssetSubmissionInterface) {
      state.assetSubmission = new AssetSubmission(assetSubmission);
    },
    SET_STATUS_BY_INDEX(state: AssetSubmissionState, index: number) {
      state.assetSubmission.setStatusFromIndex(index);
    },
  },
  actions: {
    fetchById({ commit, state }: ActionContext<AssetSubmissionState, AssetSubmissionState>, id: number) {
      if (state.assetSubmission.id != id) {
        commit('CLEAR');
      }
      return backend
        .post('/submission/details', { id: id })
        .then(result => {
          commit('SET', result.data);
        })
        .catch(err => {
          throw err;
        });
    },
    set(
      { commit, state }: ActionContext<AssetSubmissionState, AssetSubmissionState>,
      assetSubmission: AssetSubmissionInterface,
    ) {
      commit('SET', assetSubmission);
    },
    refresh({ state, dispatch }: ActionContext<AssetSubmissionState, AssetSubmissionState>) {
      return dispatch('fetchById', state.assetSubmission.id);
    },
  },
};
