<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/QaReview.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import store from '@/store/index';
import { mapState } from 'vuex';
import DashboardTabs from '@/components/navigation/DashboardTabs.vue';
import JobResultsWithPreview from '@/components/job/JobResultsWithPreview.vue';
import { JOB_STATUS_TYPE } from '@/store/interfaces/types/JobStatusType';
import { FilterJobsInterface } from '@/store/interfaces/FilterJobs';

export default Vue.extend({
  name: 'qa-review',
  metaInfo: {
    title: 'QA Review | 3XR',
  },
  components: {
    DashboardTabs,
    JobResultsWithPreview,
  },
  computed: {
    isAdmin: () => store.getters.user.isAdmin,
    statusFilterId: () => {
      // Client QA if client, 3XR QA otherwise
      return store.getters.user.isClient ? JOB_STATUS_TYPE.CLIENT_QA : JOB_STATUS_TYPE.TECHNICAL_QA;
    },
    ...mapState({
      jobs: (state: any) => state.jobs.jobs,
    }),
  },
  watch: {
    '$store.getters.user.role': function (): void {
      this.getFilteredData();
    },
  },
  created() {
    this.getFilteredData();
  },
  methods: {
    async getFilteredData() {
      this.loading = true;
      const filter: FilterJobsInterface = {
        artistUserId: 0,
        brandId: 0,
        classId: 0,
        clientId: 0,
        dateDueBefore: '',
        dateDueAfter: '',
        dateSearchIsForApprovals: false,
        projectIds: [0],
        resultsPerPage: 15,
        searchString: '',
        statusIds: [this.statusFilterId],
        studioId: 0,
        submissionCount: -1,
        withModelDownloads: false,
      };
      await store.dispatch.jobs.refreshWithFilter(filter);
      this.loading = false;
    },
  },
  data: () => ({
    errorMessage: '',
    loading: true,
  }),
});
</script>
