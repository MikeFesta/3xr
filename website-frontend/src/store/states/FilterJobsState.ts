// SPDX-License-Identifier: Apache-2.0
import { ActionContext } from 'vuex';
import FilterJobs, { FilterJobsInterface } from '@/store/interfaces/FilterJobs';
import router from '@/router';
import { RootState } from '@/store/index';

export interface FilterJobsState {
  filterJobs: FilterJobsInterface;
}

export default {
  namespaced: true as true,
  state: {
    filterJobs: new FilterJobs(null),
  } as FilterJobsState,
  mutations: {
    SET(state: FilterJobsState, project: FilterJobs) {
      state.filterJobs = new FilterJobs(project);
    },
    SET_ARTIST_USER_ID(state: FilterJobsState, artistUserId: number) {
      state.filterJobs.artistUserId = artistUserId;
    },
    SET_BRAND_ID(state: FilterJobsState, brandId: number) {
      state.filterJobs.brandId = brandId;
    },
    SET_CLASS_ID(state: FilterJobsState, classId: number) {
      state.filterJobs.classId = classId;
    },
    SET_CLIENT_ID(state: FilterJobsState, clientId: number) {
      state.filterJobs.clientId = clientId;
    },
    SET_DATE_DUE_AFTER(state: FilterJobsState, dateDueAfter: string) {
      state.filterJobs.dateDueAfter = dateDueAfter;
    },
    SET_DATE_DUE_BEFORE(state: FilterJobsState, dateDueBefore: string) {
      state.filterJobs.dateDueBefore = dateDueBefore;
    },
    SET_PROJECT_IDS(state: FilterJobsState, projectIds: number[]) {
      state.filterJobs.projectIds = projectIds;
    },
    SET_RESULTS_PER_PAGE(state: FilterJobsState, resultsPerPage: number) {
      state.filterJobs.resultsPerPage = resultsPerPage;
    },
    SET_SEARCH_STRING(state: FilterJobsState, searchString: string) {
      state.filterJobs.searchString = searchString;
    },
    SET_STATUS_IDS(state: FilterJobsState, statusIds: number[]) {
      state.filterJobs.statusIds = statusIds;
    },
    SET_STUDIO_ID(state: FilterJobsState, studioId: number) {
      state.filterJobs.studioId = studioId;
    },
    SET_SUBMISSION_COUNT(state: FilterJobsState, submissionCount: number) {
      state.filterJobs.submissionCount = submissionCount;
    },
  },
  getters: {},
  actions: {
    setFromQuery({ commit, dispatch, state }: ActionContext<FilterJobsState, RootState>, query: object) {
      commit('SET', query);
      return dispatch('jobs/refreshWithFilter', state.filterJobs, {
        root: true,
      });
    },
    setArtistUserId(
      { commit, dispatch, state }: ActionContext<FilterJobsState, RootState>,
      artistUserId: number,
    ): Promise<any> {
      if (state.filterJobs.artistUserId != artistUserId) {
        commit('SET_ARTIST_USER_ID', artistUserId);
        if (artistUserId > 0) {
          router.replace({
            query: {
              ...router.currentRoute.query,
              artistUserId: artistUserId.toString(),
            },
          });
        } else {
          let q = Object.assign({}, router.currentRoute.query);
          delete q.artistUserId;
          router.replace({ query: q });
        }
        return dispatch('jobs/refreshWithFilter', state.filterJobs, {
          root: true,
        });
      } else {
        return Promise.resolve();
      }
    },
    setBrandId({ commit, dispatch, state }: ActionContext<FilterJobsState, RootState>, brandId: number): Promise<any> {
      if (state.filterJobs.brandId != brandId) {
        commit('SET_BRAND_ID', brandId);
        if (brandId > 0) {
          router.replace({
            query: {
              ...router.currentRoute.query,
              brandId: brandId.toString(),
            },
          });
        } else {
          let q = Object.assign({}, router.currentRoute.query);
          delete q.brandId;
          router.replace({ query: q });
        }
        return dispatch('jobs/refreshWithFilter', state.filterJobs, {
          root: true,
        });
      } else {
        return Promise.resolve();
      }
    },
    setClassId({ commit, dispatch, state }: ActionContext<FilterJobsState, RootState>, classId: number): Promise<any> {
      if (state.filterJobs.classId != classId) {
        commit('SET_CLASS_ID', classId);
        if (classId > 0) {
          router.replace({
            query: {
              ...router.currentRoute.query,
              classId: classId.toString(),
            },
          });
        } else {
          let q = Object.assign({}, router.currentRoute.query);
          delete q.classId;
          router.replace({ query: q });
        }
        return dispatch('jobs/refreshWithFilter', state.filterJobs, {
          root: true,
        });
      } else {
        return Promise.resolve();
      }
    },
    setClientId(
      { commit, dispatch, state }: ActionContext<FilterJobsState, RootState>,
      clientId: number,
    ): Promise<any> {
      if (state.filterJobs.clientId != clientId) {
        commit('SET_CLIENT_ID', clientId);
        if (clientId > 0) {
          router.replace({
            query: {
              ...router.currentRoute.query,
              clientId: clientId.toString(),
            },
          });
        } else {
          let q = Object.assign({}, router.currentRoute.query);
          delete q.clientId;
          router.replace({ query: q });
        }
        return dispatch('jobs/refreshWithFilter', state.filterJobs, {
          root: true,
        });
      } else {
        return Promise.resolve();
      }
    },
    setDateDueAfter(
      { commit, dispatch, state }: ActionContext<FilterJobsState, RootState>,
      dateDueAfter: string,
    ): Promise<any> {
      if (state.filterJobs.dateDueAfter != dateDueAfter) {
        commit('SET_DATE_DUE_AFTER', dateDueAfter);
        if (dateDueAfter) {
          router.replace({
            query: {
              ...router.currentRoute.query,
              dateDueAfter: dateDueAfter,
            },
          });
        } else {
          let q = Object.assign({}, router.currentRoute.query);
          delete q.dateDueAfter;
          router.replace({ query: q });
        }
        return dispatch('jobs/refreshWithFilter', state.filterJobs, {
          root: true,
        });
      } else {
        return Promise.resolve();
      }
    },
    setDateDueBefore(
      { commit, dispatch, state }: ActionContext<FilterJobsState, RootState>,
      dateDueBefore: string,
    ): Promise<any> {
      if (state.filterJobs.dateDueBefore != dateDueBefore) {
        commit('SET_DATE_DUE_BEFORE', dateDueBefore);
        if (dateDueBefore) {
          router.replace({
            query: {
              ...router.currentRoute.query,
              dateDueBefore: dateDueBefore,
            },
          });
        } else {
          let q = Object.assign({}, router.currentRoute.query);
          delete q.dateDueBefore;
          router.replace({ query: q });
        }
        return dispatch('jobs/refreshWithFilter', state.filterJobs, {
          root: true,
        });
      } else {
        return Promise.resolve();
      }
    },
    setProjectIds(
      { commit, dispatch, state }: ActionContext<FilterJobsState, RootState>,
      projectIds: number[],
    ): Promise<any> {
      commit('SET_PROJECT_IDS', projectIds);
      if (projectIds[0] > 0) {
        router.replace({
          query: {
            ...router.currentRoute.query,
            poId: projectIds.join('-'),
          },
        });
      } else {
        // Select all
        let q = Object.assign({}, router.currentRoute.query);
        delete q.poId;
        router.replace({ query: q });
      }
      return dispatch('jobs/refreshWithFilter', state.filterJobs, {
        root: true,
      });
    },
    setStatusIds(
      { commit, dispatch, state }: ActionContext<FilterJobsState, RootState>,
      statusIds: number[],
    ): Promise<any> {
      commit('SET_STATUS_IDS', statusIds);
      if (statusIds[0] > 0) {
        router.replace({
          query: {
            ...router.currentRoute.query,
            statusId: statusIds.join('-'),
          },
        });
      } else {
        // Select all
        let q = Object.assign({}, router.currentRoute.query);
        delete q.statusId;
        router.replace({ query: q });
      }
      return dispatch('jobs/refreshWithFilter', state.filterJobs, {
        root: true,
      });
    },
    setStudioId({ commit, dispatch, state }: ActionContext<FilterJobsState, RootState>, studioId: number): Promise<any> {
      if (state.filterJobs.studioId != studioId) {
        commit('SET_STUDIO_ID', studioId);
        if (studioId > 0) {
          router.replace({
            query: {
              ...router.currentRoute.query,
              studioId: studioId.toString(),
            },
          });
        } else {
          let q = Object.assign({}, router.currentRoute.query);
          delete q.studioId;
          router.replace({ query: q });
        }
        return dispatch('jobs/refreshWithFilter', state.filterJobs, {
          root: true,
        });
      } else {
        return Promise.resolve();
      }
    },
    setSearchString(
      { commit, dispatch, state }: ActionContext<FilterJobsState, RootState>,
      searchString: string,
    ): Promise<any> {
      if (state.filterJobs.searchString != searchString) {
        commit('SET_SEARCH_STRING', searchString);
        if (searchString != '' && searchString != null) {
          router.replace({
            query: {
              ...router.currentRoute.query,
              s: encodeURIComponent(searchString),
            },
          });
        } else {
          let q = Object.assign({}, router.currentRoute.query);
          delete q.s;
          router.replace({ query: q });
          // Only re-hit the backend when clearing the search string
          return dispatch('jobs/refreshWithFilter', state.filterJobs, {
            root: true,
          });
        }
        return Promise.resolve();
      } else {
        return Promise.resolve();
      }
    },
    setSubmissionCount(
      { commit, dispatch, state }: ActionContext<FilterJobsState, RootState>,
      submissionCount: number,
    ): Promise<any> {
      if (state.filterJobs.submissionCount != submissionCount) {
        commit('SET_SUBMISSION_COUNT', submissionCount);
        if (submissionCount > -1) {
          router.replace({
            query: {
              ...router.currentRoute.query,
              submissionCount: submissionCount.toString(),
            },
          });
        } else {
          let q = Object.assign({}, router.currentRoute.query);
          delete q.submissionCount;
          router.replace({ query: q });
        }
        return dispatch('jobs/refreshWithFilter', state.filterJobs, {
          root: true,
        });
      } else {
        return Promise.resolve();
      }
    },
  },
};
