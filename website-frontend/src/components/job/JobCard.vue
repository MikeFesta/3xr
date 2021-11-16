<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/job/JobCard.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { JobInterface } from '@/store/interfaces/Job';
import XrImg from '@/components/image/XrImg.vue';
import DialogComponent from '@/components/dialog/DialogComponent.vue';
import store from '@/store';
import { ProjectInterface } from '@/store/interfaces/Project';

interface InfoSection {
  label: string;
  value: string;
}

export default Vue.extend({
  name: 'job-card',
  components: { XrImg, DialogComponent },
  props: {
    job: Object as () => JobInterface,
    project: Object as () => ProjectInterface,
    selected: Boolean,
  },
  data: () => ({
    isDelete: false,
  }),
  computed: {
    role: () => store.getters.user.role,
    isClient: () => store.getters.user.isClient,
    isAdmin: () => store.getters.user.isAdmin,
    isStudioAdmin: () => store.getters.user.isStudioAdmin,
    isJobPendingReview: function (): boolean {
      return store.getters.job.isPendingReview(this.job);
    },
    isJobAssigned: function (): boolean {
      return store.getters.job.isJobAssigned(this.job);
    },
    isJobUnassigned: function (): boolean {
      return store.getters.job.isJobUnassigned(this.job);
    },
    isProjectUnsubmitted: function (): boolean {
      return store.getters.project.isUnsubmitted(this.project);
    },
    isImportedJobAndReadyToSubmit: function (): boolean {
      return (
        this.project.isCreatedFromHolding &&
        store.getters.project.isUnsubmitted(this.project) &&
        !store.getters.job.isPendingReview(this.job)
      );
    },
    /**
     *  Jobs highlighted based on one of two conditions.
     *
     * 1) Pending review, show highlighted message
     * 2) Assigned, pending PO submission ∴ prompt to submit PO
     */
    isHighlightedImportedJobStatus(): boolean {
      const isPendingReview = store.getters.job.isPendingReview(this.job);
      const isProjectUnsubmitted = store.getters.project.isUnsubmitted(this.project);
      return store.getters.job.isPendingReview(this.job) || (this.project.isCreatedFromHolding && isProjectUnsubmitted);
    },
    highlightedImportedJobStatusLabel(): string {
      return store.getters.job.isPendingReview(this.job) ? 'Needs review' : 'Ready to submit';
    },
    jobSelected: {
      get() {
        return this.selected;
      },
      set(selected: boolean) {
        this.$emit('selected', { job: this.job, selected });
      },
    },
  },
  methods: {
    toggleDeleteModal() {
      this.isDelete = !this.isDelete;
    },
    async deleteJob() {
      if (this.job.uid) {
        await store.dispatch.job.deleteJobByUid(this.job.uid);
      }
      this.isDelete = false;
    },
    handleProductEdit() {
      this.$router.push({
        name: 'product-details',
        params: {
          uid: this.job.product.uid,
          productTableEditEnabled: 'true',
        },
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.green-font {
  color: $color-green !important;
}
.product-image {
  max-height: 150px;
  max-width: 150px;
}
.artist-hr {
  border-top: #f5f7fc solid 2px;
  margin-top: 0px;
  padding-top: 15px;
}
.check-artist {
  margin-top: 5px;
}
.name-length {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.descriptors {
  font-size: 16px;
  padding-left: 5px;
  margin-top: 0;
}
.controls {
  display: flex;
  position: absolute;
  right: 18px;
}
</style>
