<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/qa/QaSubmissionIssueForm.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import backend from '@/services/3xrCom';
import { mapState } from 'vuex';
import store from '@/store/index';
import AssetSubmissionIssueType from '@/store/interfaces/types/AssetSubmissionIssueType';
import SpinnerButton from '@/components/buttons/SpinnerButton.vue';
import x from '@/services/x';
import { JOB_STATUS_TYPE } from '@/store/interfaces/types/JobStatusType';
import AssetSubmissionIssueHotspot from '@/store/interfaces/AssetSubmissionIssueHotspot';

export default Vue.extend({
  created() {
    store.dispatch.assetSubmissionIssueHotspots.clear();
  },
  components: {
    SpinnerButton,
  },
  computed: {
    isAdmin: () => store.getters.user.isAdmin,
    isArtist: () => store.getters.user.isArtist,
    isClient: () => store.getters.user.isClient,
    isQa: () => store.getters.user.isQa,
    options: function () {
      return this.pickList.assetSubmissionIssues.filter(
        (issue: AssetSubmissionIssueType) => issue.categoryId == this.categoryId,
      );
    },
    readyForQa: function (): boolean {
      return this.assetSubmission.status.id >= 13;
    },
    readyToStartQa: function (): boolean {
      // Only the QA user can start the initial QA
      return this.assetSubmission.status.id == 13 && this.isQa;
    },
    qaInProgress: function (): boolean {
      return (
        this.assetSubmission.status.id == 14 &&
        ((this.product.job.status.id == JOB_STATUS_TYPE.TECHNICAL_QA && this.isQa) ||
          (this.product.job.status.id == JOB_STATUS_TYPE.CLIENT_QA && this.isClient))
      );
    },
    warningMessage: function (): string {
      if (!this.readyForQa) {
        return 'Not Ready For QA';
      }
      if (this.isAdmin) {
        return 'ADMIN: Switch to Client or QA role to leave feedback';
      }
      if (this.isClient && !this.qaInProgress && this.product.job.status.id != JOB_STATUS_TYPE.COMPLETE) {
        return 'You will be able to provide feedback once the job has been approved by 3XR and is in Client QA status';
      }
      if (this.isQa && !this.qaInProgress && !this.readyToStartQa) {
        return 'You can only provide feedback when the job is in 3XR QA status';
      }
      return '';
    },
    ...mapState({
      assetSubmissionIssueHotspots: (state: any) => state.assetSubmissionIssueHotspots,
      product: (state: any) => state.product.product,
      pickList: (state: any) => state.pickList.pickList,
      user: (state: any) => state.user.user,
    }),
  },
  data: () => ({
    description: '',
    errorMessage: '',
    imageFilenames: [] as Array<string>,
    selectedValue: '',
    startingReview: false,
    uploading: false,
    uploadProgress: 0,
  }),
  methods: {
    addHotspot() {
      store.dispatch.assetSubmissionIssueHotspots.startAdding();
      const overlay = document.getElementById('addHotspot');
      if (overlay) {
        overlay.focus();
      }
    },
    cancelAddingHotspot() {
      store.dispatch.assetSubmissionIssueHotspots.stopAdding();
    },
    clearError() {
      this.errorMessage = '';
    },
    openIssue() {
      backend
        .post('submission/issue/new', {
          id: this.assetSubmission.id,
          issueTypeId: this.selectedValue,
          description: this.description,
          imageFilenames: this.imageFilenames,
          hotspots: this.assetSubmissionIssueHotspots.assetSubmissionIssueHotspots.filter(
            (hotspot: AssetSubmissionIssueHotspot) => !hotspot.deleted,
          ),
        })
        .then((result) => {
          store.dispatch.assetSubmission.set(result.data);
          store.dispatch.assetSubmissionIssueHotspots.clear();
          // Note: although the data has changed, the new hotspot(s) do not show on the 3d viewer
          // Hack: Force the viewer to re-render by going into and out of edit mode
          store.dispatch.assetSubmissionIssueHotspots.startAdding();
          this.$nextTick(function () {
            store.dispatch.assetSubmissionIssueHotspots.stopAdding();
          });
          // Bug: https://github.com/vuetifyjs/vuetify/issues/11225
          // When adding a new issue, the panel index is incorrect, and the wrong hotspot will be selected
          this.description = '';
          this.selectedValue = '';
          this.imageFilenames = [];
        })
        .catch((err) => {
          this.errorMessage = err;
        });
    },
    removeHotspot(id: number) {
      store.dispatch.assetSubmissionIssueHotspots.removeHotspot(id);
    },
    startReview() {
      this.startingReview = true;
      backend
        .post('submission/start_review', {
          id: this.assetSubmission.id,
        })
        .then((result) => {
          store.dispatch.assetSubmission.set(result.data);
          store.dispatch.product.refresh();
          this.startingReview = false;
        })
        .catch((err) => {
          this.errorMessage = err;
        });
    },
    uploadImages(files: Array<any>) {
      // Not ideal, but images are uploaded before the issue is created
      // Need to save the filenames and submit with Open Issue function
      this.uploading = true;
      let formData = new FormData();
      let filenames: Array<string> = [];
      formData.append('assetUid', this.assetSubmission.asset.uid);
      formData.append('submissionNumber', this.assetSubmission.submissionNumber);
      for (let i = 0; i < files.length; i++) {
        filenames.push(files[i].name);
        formData.append('images', files[i]);
      }
      x.post('upload/asset_submission_issue_images', formData, {
        onUploadProgress: (progressEvent: ProgressEvent) => {
          this.uploadProgress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        },
      })
        .then((result) => {
          if (result.data == 'success') {
            this.uploading = false;
            for (let i = 0; i < filenames.length; i++) {
              this.imageFilenames.push(filenames[i]);
            }
            // TODO
            // delete image (?)
            // image zoom
            // image response ?
          } else {
            this.uploading = false;
            this.errorMessage = 'Upload Failed';
          }
        })
        .catch((err) => {
          this.errorMessage = 'Image Upload Failed';
        });
    },
  },
  props: {
    categoryId: Number,
    assetSubmission: Object,
  },
});
</script>

<style lang="scss" scoped>
.margin-btm-neg-less {
  margin-bottom: -20px;
}
.not-ready {
  color: #d82849;
  font-size: 24px;
  padding: 40px 10px;
  text-align: center;
  border: 2px solid #dadada;
  margin-bottom: 10px;
}
</style>
