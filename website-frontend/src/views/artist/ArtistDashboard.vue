<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/artist/ArtistDashboard.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { vuetifyComponents } from '@/plugins/vuetify';
import JobResultsWithPreview from '@/components/job/JobResultsWithPreview.vue';
import store from '@/store/index';

export default Vue.extend({
  name: 'artist-dashboard',
  metaInfo: {
    title: 'Dashboard | 3XR',
  },
  components: {
    ...vuetifyComponents,
    JobResultsWithPreview,
  },
  async created() {
    this.loading = true;
    store.commit.jobs.CLEAR();
    try {
      await store.dispatch.jobs.fetchJobsByRoleArtist();
    } catch (err) {
      this.loading = false;
      this.errorMessage = 'Unable to load jobs. ' + err;
    }
  },
  data: () => ({
    errorMessage: '',
    loading: false,
    loadingPreview: false,
    previewOpen: false,
  }),
});
</script>
