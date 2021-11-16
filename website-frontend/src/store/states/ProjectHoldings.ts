// SPDX-License-Identifier: Apache-2.0
import { ActionContext } from 'vuex';
import { ProjectHoldingAttributes } from '3xr_types';
import backend from '@/services/3xrCom';
import { RootState } from '@/store';
import ProjectHolding from '@/store/interfaces/ProjectHolding';

export interface ProjectHoldingState {
  projectHoldings: ProjectHoldingAttributes[];
}

export default {
  namespaced: true as true,
  state: {
    projectHoldings: [],
  } as ProjectHoldingState,
  mutations: {
    CLEAR(state: ProjectHoldingState) {
      state.projectHoldings = [];
    },
    SET(state: ProjectHoldingState, projectHoldings: ProjectHoldingAttributes[]) {
      state.projectHoldings = projectHoldings.map((data) => new ProjectHolding(data));
    },
  },
  getters: {},
  actions: {
    async fetchProjectHolding({ commit, state }: ActionContext<ProjectHoldingState, RootState>) {
      try {
        const projectHoldingResult = await backend.get(`/project/client_holdings`);
        commit('SET', projectHoldingResult.data);
      } catch (err) {
        throw err;
      }
    },
  }
};
