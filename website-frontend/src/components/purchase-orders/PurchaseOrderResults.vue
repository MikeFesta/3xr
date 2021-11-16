<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="./PurchaseOrderResults.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapGetters } from 'vuex';
import { arrayUniqueItemsFilter } from '@/helpers';
import { JobInterface, JobSelected } from '@/store/interfaces/Job';
import User from '@/store/interfaces/User';
import JobCard from '@/components/job/JobCard.vue';
import DialogComponent from '@/components/dialog/DialogComponent.vue';
import ProductDetails from '@/views/product/ProductDetails.vue';
import store, { RootState } from '@/store';
import { ProjectInterface } from '@/store/interfaces/Project';
import { PROJECT_STATUS_TYPE } from '@/store/interfaces/types/ProjectStatusType';

interface AssignedArtist {
  username: string;
  count: number;
}

type MaybeUser = User | undefined;

export default Vue.extend({
  name: 'purchase-order-results',
  components: {
    JobCard,
    DialogComponent,
    ProductDetails,
  },
  data: () => ({
    loadingPreview: false,
    previewErrorMessage: '',
    selectedJobs: [] as JobInterface[],
    confirmAssignment: false,
    selectedArtist: {} as MaybeUser,
    editUid: '',
    isDialogActive: false,
  }),
  created() {
    store.dispatch.artists.loadAllForAdmin();
    if (this.$route.query.editUid) {
      this.editUid = this.$route.query.editUid as string;
    }
  },
  watch: {
    '$route.query.editUid': function (newValue: string) {
      this.editUid = newValue;
    },
  },
  computed: {
    countOfUniqueModels(): number {
      return this.jobs.map((job: JobInterface) => job.product.uid).filter(arrayUniqueItemsFilter).length;
    },
    hasNoProducts(): boolean {
      return this.countOfUniqueModels == 0;
    },
    isAllJobsReviewed(): boolean {
      return this.jobs.every((job: JobInterface) => !store.getters.job.isPendingReview(job));
    },
    assignedArtists(): AssignedArtist[] {
      // returns list of unique artists assigned to jobs in Purchase Order, sorted by count number
      const artistDictionary = this.jobs.reduce((acc: any, { product: { artist } }: JobInterface) => {
        if (artist.username) {
          acc[artist.username] = (acc[artist.username] || 0) + 1; // increment count
        }
        return acc;
      }, {});
      return Object.keys(artistDictionary)
        .map((username) => ({ username, count: artistDictionary[username] }))
        .sort((prev, current) => current.count - prev.count);
    },
    ...mapGetters('user', ['isAdmin', 'isClient', 'isStudioAdmin']),
    ...mapGetters('artists', ['artistFilter']),
    ...mapGetters('jobs', {
      jobsPendingReviewCount: 'jobsPendingReviewCount',
    }),
    ...mapState({
      artists(state: RootState): User[] {
        return state.artists.artists;
      },
      jobs(state: RootState): JobInterface[] {
        return state.jobs.jobs;
      },
      project(state: RootState): ProjectInterface {
        return state.project.project;
      },
      isProjectCompleted: (state: RootState) => state.project.project.status.id === PROJECT_STATUS_TYPE.COMPLETE,
      isProjectSubmitted: (state: RootState) => state.project.project.status.id !== PROJECT_STATUS_TYPE.UNSUBMITTED,
    }),
    isAdmin: () => store.getters.user.isAdmin,
    assignedJobs(): number {
      return this.jobs.reduce((acc: number, curr: JobInterface) => {
        if (curr.status.id > 1) {
          return acc + 1;
        }
        return acc;
      }, 0);
    },
  },
  methods: {
    handleJobToggle({ job, selected }: JobSelected) {
      if (selected) {
        this.selectedJobs.push(job);
      } else {
        this.selectedJobs = this.selectedJobs.filter((selectedJob) => selectedJob.uid !== job.uid);
      }
    },
    resetSelectedJobs() {
      this.selectedJobs = [];
    },
    selectAllJobs() {
      this.selectedJobs = [...this.jobs];
    },
    isSelectedJob(job: JobInterface): boolean {
      return this.selectedJobs.some(({ uid }) => uid === job.uid);
    },
    async assignArtist() {
      if (!this.selectedArtist) {
        return null;
      }
      this.confirmAssignment = false;
      const uids = this.selectedJobs.map(({ product: { uid } }) => uid);

      await store.dispatch.product.assignArtist({
        uids,
        artistId: this.selectedArtist.id,
        projectUid: this.projectUid,
      });
      this.selectedJobs = [];
    },
    confirmAssignArtist(artistId: number) {
      this.confirmAssignment = true;
      const artist = this.artists.find((artist: User) => artist.id === artistId);
      if (artist) {
        this.selectedArtist = artist;
      }
    },
    closeConfirmAssignArtist() {
      this.confirmAssignment = false;
      this.selectedJobs = [];
    },
    clearQuery() {
      this.$router.push({ query: {} });
    },
    toggleDialog() {
      this.isDialogActive = !this.isDialogActive;
    },
    async handleSubmit() {
      await this.submitPurchaseOrder();
      this.toggleDialog();
    },
  },
  props: {
    admin: Boolean,
    isSubmittedDialogOpen: Boolean,
    closeSubmittedDialog: Function,
    errorMessage: String,
    loading: Boolean,
    submitPurchaseOrder: Function,
    deleteJobById: Function,
    projectUid: String,
    statusFilterId: Number,
    title: String,
  },
});
</script>

<style lang="scss" scoped>
.v-card {
  padding: 0px;
}
.expected {
  font-size: 20px;
}
.submit-btn {
  width: 200px;
}
.add-product-btn {
  color: #2d2d2d;
  text-transform: none;
  font-size: 18px;
  letter-spacing: normal;
}
.selection-btn {
  border: #aaa solid 1px !important;
  border-radius: 5;
  text-transform: none;
  font-size: 16px;
  letter-spacing: normal;
  margin-top: 1px;
  height: 40px !important;
}
.artist-overflow {
  max-height: 40px;
  overflow: scroll;
  padding-right: 20px;
}
.menu {
  display: flex;
  align-items: flex-start;
  min-height: 78px;
  margin-right: 10px;
}
.btn-wrapper {
  width: 180px;
}
.disabled-cursor {
  cursor: not-allowed;
}
</style>
