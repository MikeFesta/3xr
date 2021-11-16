// SPDX-License-Identifier: Apache-2.0
import Project, { ProjectInterface } from '@/store/interfaces/Project';
import { ActionContext } from 'vuex';
import backend from '@/services/3xrCom';
import store, { RootState } from '@/store';

export interface ProjectsState {
  projects: Array<ProjectInterface>;
}

export default {
  namespaced: true as true,
  state: {
    projects: [],
  } as ProjectsState,
  mutations: {
    CLEAR(state: ProjectsState) {
      state.projects = [];
    },
    SET(state: ProjectsState, projects: Array<ProjectInterface>) {
      let projectObjects = [];
      for (let i = 0; i < projects.length; i++) {
        projectObjects.push(new Project(projects[i]));
      }
      state.projects = projectObjects;
    },
  },
  actions: {
    async loadPicklist({ commit }: ActionContext<ProjectsState, RootState>) {
      commit('CLEAR');
      const response = await backend.get('/project/project_picklist');
      commit('SET', response.data);
    },
    async loadPurchaseOrders({ commit, dispatch }: ActionContext<ProjectsState, RootState>) {
      commit('CLEAR');
      const response = await backend.get('/project/my_projects');
      commit('SET', response.data);
    },
    async submitPurchaseOrder({ commit }: ActionContext<ProjectsState, RootState>, uid: string) {
      if (store.getters.user.authenticated) {
        const response = await backend.post('/project/submit', { uid });
        commit('SET', response.data);
      }
    },
  },
};
