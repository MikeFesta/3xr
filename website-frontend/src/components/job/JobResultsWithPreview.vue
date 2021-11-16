<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/job/JobResultsWithPreview.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import store from '@/store/index';
import { vuetifyComponents } from '@/plugins/vuetify';
import backend from '@/services/3xrCom';
import JobDashboardTable from '@/components/job/JobDashboardTable.vue';
import JobPreview from '@/components/job/JobPreview.vue';

export default Vue.extend({
  name: 'job-results-with-preview',
  components: {
    ...vuetifyComponents,
    JobDashboardTable,
    JobPreview,
  },
  computed: {
    resultsWidth(): Number {
      return this.previewOpen ? 6 : 12;
    },
  },
  data: () => ({
    loadingPreview: false,
    previewErrorMessage: '',
    previewOpen: false,
  }),
  methods: {
    closePreview() {
      this.previewOpen = false;
      this.previewErrorMessage = '';
    },
    showPreview(uid: string) {
      this.loadingPreview = true;
      this.previewErrorMessage = '';
      this.previewOpen = true;
      backend
        .post('/job/preview', { uid })
        .then((result) => {
          store.commit.job.SET(result.data);
          store.commit.product.SET_PRODUCT(result.data.product);
          store.commit.asset.SET(result.data.product.asset);
          this.loadingPreview = false;
        })
        .catch((err) => {
          this.loadingPreview = false;
          this.previewErrorMessage = 'Unable to load job preview.';
        });
    },
  },
  props: {
    admin: Boolean,
    dateSearchIsForApprovals: Boolean,
    errorMessage: String,
    loading: Boolean,
    projectUid: String,
    showDownloads: Boolean,
    statusFilterId: Number,
    title: String,
  },
});
</script>
