<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/Jobs.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import store from '@/store/index';
import { mapState } from 'vuex';
import DashboardTabs from '@/components/navigation/DashboardTabs.vue';
import JobResultsWithPreview from '@/components/job/JobResultsWithPreview.vue';

export default Vue.extend({
  name: 'jobs',
  metaInfo: {
    title: 'Jobs | 3XR',
  },
  components: {
    DashboardTabs,
    JobResultsWithPreview,
  },
  computed: {
    isAdmin: () => store.getters.user.isAdmin,
    ...mapState({
      jobs: (state: any) => state.jobs.jobs,
      filterJobs: (state: any) => state.filterJobs.filterJobs,
    }),
  },
  created() {
    this.loadJobs();
  },
  data: () => ({
    errorMessage: '',
    loading: true,
  }),
  methods: {
    loadJobs: function (): void {
      this.loading = true;
      store.dispatch.filterJobs
        .setFromQuery({ ...this.$route.query })
        .then((filterSet) => {
          this.loading = false;
        })
        .catch((err) => {
          this.errorMessage = 'Unable to load admin jobs. ' + err;
          this.loading = false;
        });
    },
  },
  watch: {
    '$store.getters.user.role': function (): void {
      this.loadJobs();
    },
  },
});
</script>
