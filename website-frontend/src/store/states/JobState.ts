// SPDX-License-Identifier: Apache-2.0
import { ActionContext } from 'vuex';
import backend from '@/services/3xrCom';
import { JOB_STATUS_TYPE } from '@/store/interfaces/types/JobStatusType';
import Job, { JobInterface, JobUpdateInterface } from '@/store/interfaces/Job';
import { RootState } from '@/store/index';
import { AxiosResponse } from 'axios';

export interface JobState {
  job: JobInterface;
}

export default {
  namespaced: true as true,
  state: {
    job: new Job(null),
  } as JobState,
  mutations: {
    CLEAR(state: JobState) {
      state.job = new Job(null);
    },
    SET(state: JobState, job: Job) {
      state.job = new Job(job);
    },
  },
  getters: {
    isPendingReview: () => (job: JobInterface) => job.status.id === JOB_STATUS_TYPE.PENDING_REVIEW,
    isJobAssigned: () => (job: JobInterface) => job.status.id === JOB_STATUS_TYPE.ASSIGNED,
    isJobUnassigned: () => (job: JobInterface) => job.status.id === JOB_STATUS_TYPE.UNASSIGNED,
  },
  actions: {
    async fetchByUid({ commit, state }: ActionContext<JobState, RootState>, uid: string) {
      if (state.job.uid !== uid) {
        commit('CLEAR');
      }
      const result = await backend.post('/job/job_details', { uid });
      commit('SET', result.data);
    },
    async createOrUpdateJob(
      { commit }: ActionContext<JobState, RootState>,
      payload: JobUpdateInterface,
    ): Promise<JobInterface> {
      const response: AxiosResponse<JobInterface> = await backend.post('job/create_or_update', payload);
      commit('SET', response.data);
      return response.data;
    },
    async createFromProductHolding({ commit }: ActionContext<JobState, RootState>, payload: JobUpdateInterface) {
      const response = await backend.post('job/create_from_product_hoding', payload);
      commit('SET', response.data);
    },
    async deleteJobById({ commit }: ActionContext<JobState, RootState>, jobId: String) {
      // Note: this may be depricated and replaced with by Uid
      await backend.post(`/job/delete/${jobId}`);
    },
    async deleteJobByUid({ dispatch, rootState }: ActionContext<JobState, RootState>, jobUid: string) {
      const result = await backend.post(`/job/delete/${jobUid}`);
      if (result.data) {
        const updatedJobs = rootState.jobs.jobs.filter(({ uid }) => uid !== jobUid);
        return dispatch('jobs/setJobs', updatedJobs, { root: true });
      }
    },
    refresh({ state, dispatch }: ActionContext<JobState, RootState>) {
      return dispatch('fetchByUid', state.job.uid);
    },
  },
};
