<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/Complete.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import store from '@/store/index';
import { mapState } from 'vuex';
import DashboardTabs from '@/components/navigation/DashboardTabs.vue';
import JobResultsWithPreview from '@/components/job/JobResultsWithPreview.vue';
import { JOB_STATUS_TYPE } from '@/store/interfaces/types/JobStatusType';

export default Vue.extend({
  name: 'jobs-complete',
  metaInfo: {
    title: 'Jobs Complete | 3XR',
  },
  components: {
    DashboardTabs,
    JobResultsWithPreview,
  },
  computed: {
    isAdmin: () => store.getters.user.isAdmin,
    statusFilterId: () => {
      return JOB_STATUS_TYPE.COMPLETE;
    },
    ...mapState({
      jobs: (state: any) => state.jobs.jobs,
      filterJobs: (state: any) => state.filterJobs.filterJobs,
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
      store.dispatch.filterJobs
        .setFromQuery({ ...this.$route.query, statusIds: [9], withModelDownloads: true })
        .then((filterSet) => {
          this.loading = false;
        })
        .catch((err) => {
          this.errorMessage = 'Unable to load complete jobs. ' + err;
          this.loading = false;
        });
    },
  },
  data: () => ({
    errorMessage: '',
    loading: true,
  }),
});
</script>
