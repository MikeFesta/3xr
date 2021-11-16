// SPDX-License-Identifier: Apache-2.0
import { ClientInterface } from '@/store/interfaces/Client';
import backend from '@/services/3xrCom';
import Project, { ProjectInterface } from '@/store/interfaces/Project';
import { UNIT_TYPE } from '@/store/interfaces/types/UnitType';
import { JOB_QUALITY_TYPE } from '@/store/interfaces/types/JobQualityType';
import { JOB_PRIORITY_TYPE } from '@/store/interfaces/types/JobPriorityType';
import { IPurchaseOrderRequest, IPurchaseOrderImportHoldingRequest } from '@/store/interfaces/PurchaseOrder';
import { ActionContext } from 'vuex';
import { RootState } from '@/store/index';
import store from '@/store';
import { ClientBrandInterface } from '@/store/interfaces/ClientBrand';
import { ClientClassInterface } from '@/store/interfaces/ClientClass';
import { PROJECT_STATUS_TYPE } from '@/store/interfaces/types/ProjectStatusType';

export interface ProjectState {
  project: ProjectInterface;
}

export default {
  namespaced: true as true,
  state: {
    project: new Project(null),
  } as ProjectState,
  mutations: {
    CLEAR(state: ProjectState) {
      state.project = new Project(null);
    },
    SET_CLIENT(state: ProjectState, client: ClientInterface) {
      state.project.client = client;
    },
    SET_DEADLINE_DAYS(state: ProjectState, days: number) {
      const today = new Date();
      const deadline = new Date(today.getFullYear(), today.getMonth(), today.getDate() + days);
      state.project.dateDue =
        deadline.getFullYear() +
        '-' +
        (deadline.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        deadline
          .getDate()
          .toString()
          .padStart(2, '0');
    },
    SET_NEW_DEFAULTS(state: ProjectState) {
      // Select the first brand and class from the client vuex store
      state.project.quality.id = JOB_QUALITY_TYPE.STANDARD;
      state.project.priority.id = JOB_PRIORITY_TYPE.STANDARD;
      state.project.units.id = UNIT_TYPE.INCHES;
      state.project.updatePicklists();
    },
    SET(state: ProjectState, project: Project) {
      state.project = new Project(project);
    },
    UPDATE_FROM_PICKLIST(state: ProjectState) {
      state.project.updatePicklists();
    },
    SET_BRAND(state: ProjectState, brand: ClientBrandInterface) {
      state.project.brand = brand;
    },
    SET_CLASS(state: ProjectState, classPO: ClientClassInterface) {
      state.project.class = classPO;
    },
  },
  getters: {
    isUnsubmitted: () => (project: ProjectInterface) => project.status.id === PROJECT_STATUS_TYPE.UNSUBMITTED,
  },
  actions: {
    async fetchProjectByUid({ commit }: ActionContext<ProjectState, RootState>, projectUid: string) {
      const response = await backend.get(`/project/details/${projectUid}`);
      commit('SET', response.data);
    },
    async fetchProjectAndJobsByIdByRole(
      { dispatch }: ActionContext<ProjectState, RootState>,
      projectIds: { projectUid: string; projectId: string },
    ) {
      if (store.getters.user.isAdmin) {
        await dispatch('fetchProjectAndJobsByIdAdmin', projectIds.projectUid);
      } else {
        await dispatch('fetchProjectAndJobsByIdsClient', projectIds);
      }
    },
    async fetchProjectAndJobsByIdsClient(
      { commit, dispatch }: ActionContext<ProjectState, RootState>,
      projectIds: { projectUid: string; projectId: string },
    ) {
      const response = await backend.get(`/admin/project/${projectIds.projectUid}`);
      commit('SET', response.data);
      await dispatch('jobs/fetchJobsByProjectUid', projectIds.projectUid, { root: true });
    },
    async fetchProjectAndJobsByIdAdmin(
      { commit, dispatch }: ActionContext<ProjectState, RootState>,
      projectUid: string,
    ) {
      const response = await backend.get(`/admin/project/${projectUid}`);
      commit('SET', response.data);
      if (response.data.jobs) {
        await dispatch('jobs/setJobs', response.data.jobs, { root: true });
      }
    },
    async createProject({ dispatch }: ActionContext<ProjectState, RootState>, project: IPurchaseOrderRequest) {
      const result = await backend.post('project/create_project', project);
      await dispatch('fetchProjectByUid', result.data);
    },
    async createProjectHolding(
      { dispatch }: ActionContext<ProjectState, RootState>,
      project: IPurchaseOrderImportHoldingRequest,
    ) {
      const result = await backend.post('project/create_holding', project);
      await dispatch('fetchProjectByUid', result.data);
    },
    async deleteProject({ commit, rootState }: ActionContext<ProjectState, RootState>, projectUid: string) {
      const { data } = await backend.post(`project/delete/${projectUid}`);
      if (data === 'success') {
        // deletion successful, filter out project.
        const filteredState = rootState.projects.projects.filter(
          (project: ProjectInterface) => project.uid !== projectUid,
        );
        commit('projects/SET', filteredState, { root: true });
      }
    },
    async setNewDefaults({ commit }: ActionContext<ProjectState, RootState>) {
      commit('CLEAR');
      commit('SET_NEW_DEFAULTS');
    },
    async updateProject({ commit }: ActionContext<ProjectState, RootState>, project: IPurchaseOrderRequest) {
      const result = await backend.post('project/update_project', project);
      commit('SET', result.data);
    },
    updateBrand({ commit }: ActionContext<ProjectState, RootState>, brand: ClientBrandInterface) {
      commit('SET_BRAND', brand);
    },
    updateClass({ commit }: ActionContext<ProjectState, RootState>, classPO: ClientClassInterface) {
      commit('SET_CLASS', classPO);
    },
  },
};
