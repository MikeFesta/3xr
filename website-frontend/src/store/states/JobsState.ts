// SPDX-License-Identifier: Apache-2.0
import { ActionContext } from 'vuex';
import backend from '@/services/3xrCom';
import Job, { JobInterface } from '@/store/interfaces/Job';
import { FilterJobsInterface } from '@/store/interfaces/FilterJobs';
import { RootState } from '@/store/index';

export interface JobsState {
  jobs: Array<JobInterface>;
}

export default {
  namespaced: true as true,
  state: {
    jobs: [],
  } as JobsState,
  mutations: {
    CLEAR(state: JobsState) {
      state.jobs = [];
    },
    SET(state: JobsState, jobs: Array<JobInterface>) {
      state.jobs = jobs.map((job: JobInterface) => new Job(job));
    },
    UPDATE(state: JobsState, newJob: JobInterface) {
      // find job by uid and swap for a new Job instance
      state.jobs = state.jobs.map(job => (job.uid === newJob.uid ? new Job(newJob) : job));
    },
  },
  getters: {
    jobsPendingReviewCount: (state: JobsState, commit: any, rootState: any, rootGetters: any): number =>
      state.jobs.filter(
        (job) => rootGetters['job/isPendingReview'](job)
      ).length
  },
  actions: {
    async refreshWithFilter({ commit }: ActionContext<JobsState, RootState>, filterJobs: FilterJobsInterface) {
      commit('CLEAR');
      // Load jobs based on filterState
      const result = await backend.post('/job/job_search', filterJobs);
      commit('SET', result.data);
    },
    async fetchJobsByRoleArtist({ commit }: ActionContext<JobsState, RootState>) {
      const response = await backend.get('/job/my_jobs');
      commit('SET', response.data);
    },
    async fetchJobsByProjectUid({ commit }: ActionContext<JobsState, RootState>, projectUid: string) {
      const response = await backend.post('/project/jobs', { uid: projectUid });
      commit('SET', response.data);
    },
    async deleteJobById({ commit }: ActionContext<JobsState, RootState>, jobId: String) {
      await backend.post(`/job/delete/${jobId}`);
    },
    async setJobs({ commit }: ActionContext<JobsState, RootState>, jobs: Array<JobInterface>) {
      commit('SET', jobs);
    },
    updateJob({ commit }: ActionContext<JobsState, RootState>, job: JobInterface) {
      commit('UPDATE', job);
    },
  },
};
