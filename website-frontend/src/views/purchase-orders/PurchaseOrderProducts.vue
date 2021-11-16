<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="./PurchaseOrderProducts.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import DashboardTabs from '@/components/navigation/DashboardTabs.vue';
import JobResultsWithPreview from '@/components/job/JobResultsWithPreview.vue';
import PurchaseOrderResults from '@/components/purchase-orders/PurchaseOrderResults.vue';
import PurchaseOrderBanner from '@/components/purchase-orders/PurchaseOrderBanner.vue';
import router from '@/router';
import store from '@/store/index';

export default Vue.extend({
  name: 'purchase-order-products',
  metaInfo: {
    title: 'Purchase Order Products | 3XR',
  },
  components: {
    DashboardTabs,
    JobResultsWithPreview,
    PurchaseOrderBanner,
    PurchaseOrderResults,
  },
  computed: {
    ...mapState({
      jobs: (state: any) => state.jobs.jobs,
      project: (state: any) => state.project.project,
      isAdmin: () => store.getters.user.isAdmin,
    }),
  },
  async created() {
    store.commit.jobs.CLEAR();
    // Admin server model will need more values than user model.
    if (this.project.uid != this.projectUid) {
      await (this.isAdmin ? this.fetchProjectAndJobsByIdAdmin() : this.loadProject());
    } else {
      await (this.isAdmin ? this.fetchProjectAndJobsByIdAdmin() : this.loadJobs());
      this.loadingProject = false;
    }
  },
  data: () => ({
    errorMessage: '',
    isSubmittedDialogOpen: false,
    loadingJobs: true,
    loadingProject: false,
  }),
  methods: {
    closeSubmittedDialog() {
      this.isSubmittedDialogOpen = false;
      router.push({
        name: 'purchase-orders',
      });
    },
    async loadProject() {
      try {
        this.loadingProject = true;
        await store.dispatch.project.fetchProjectByUid(this.projectUid);
        this.loadingProject = false;
        await this.loadJobs();
      } catch (err) {
        this.errorMessage = 'Unable to load Purchase Order. ' + err;
      }
    },
    async fetchProjectAndJobsByIdAdmin() {
      try {
        this.loadingProject = true;
        await store.dispatch.project.fetchProjectAndJobsByIdAdmin(this.projectUid);
        this.loadingProject = false;
        this.loadingJobs = false;
      } catch (err) {
        this.loadingProject = false;
        this.errorMessage = 'Unable to load Purchase Order. ' + err;
      }
    },
    async loadJobs() {
      try {
        this.loadingJobs = true;
        await store.dispatch.jobs.fetchJobsByProjectUid(this.project.uid || this.projectUid);
        this.loadingJobs = false;
      } catch (err) {
        this.loadingJobs = false;
        this.errorMessage = 'Unable to load project. ' + err;
      }
    },
    async deleteJobById(jobId: string) {
      try {
        this.loadingJobs = true;
        await store.dispatch.jobs.deleteJobById(jobId);
        this.loadingJobs = false;
        await this.loadJobs();
      } catch (err) {
        this.loadingJobs = false;
        this.errorMessage = 'Unable to delete job. ' + err;
      }
    },
    async submitPurchaseOrder() {
      try {
        this.loadingProject = true;
        await store.dispatch.projects.submitPurchaseOrder(this.project.uid);
        await (this.isAdmin ? this.fetchProjectAndJobsByIdAdmin() : this.loadProject());
        this.loadingProject = false;
        this.isSubmittedDialogOpen = true;
      } catch (err) {
        this.loadingProject = false;
        this.errorMessage = 'Unable to submit purchase order. ' + err;
      }
    },
  },
  props: {
    projectUid: String,
  },
});
</script>
