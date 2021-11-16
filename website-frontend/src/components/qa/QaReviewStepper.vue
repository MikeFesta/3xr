<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/qa/QaReviewStepper.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { vuetifyComponents } from '@/plugins/vuetify';
import { mapState } from 'vuex';
import backend from '@/services/3xrCom';
import AssetSubmissionTextures from '@/components/asset/AssetSubmissionTextures.vue';
import ProductDimensions from '@/components/product/ProductDimensions.vue';
import ProductImageViewer from '@/components/product/ProductImageViewer.vue';
import QaSubmissionIssueForm from '@/components/qa/QaSubmissionIssueForm.vue';
import QrCode from '@/components/3xr/QrCode.vue';
import SpinnerButton from '@/components/buttons/SpinnerButton.vue';
import store from '@/store/index';
import { JOB_STATUS_TYPE } from '@/store/interfaces/types/JobStatusType';

export default Vue.extend({
  name: 'asset-submission-review',
  components: {
    ...vuetifyComponents,
    AssetSubmissionTextures,
    ProductDimensions,
    ProductImageViewer,
    QaSubmissionIssueForm,
    QrCode,
    SpinnerButton,
  },
  computed: {
    depthError(): number {
      return (this.assetSubmission.depthInMeters / this.product.depthInMeters) * 100 - 100;
    },
    heightError(): number {
      return (this.assetSubmission.heightInMeters / this.product.heightInMeters) * 100 - 100;
    },
    isAdmin: () => store.getters.user.isAdmin,
    isArtist: () => store.getters.user.isArtist,
    isClient: () => store.getters.user.isClient,
    isQa: () => store.getters.user.isQa,
    widthError(): number {
      return (this.assetSubmission.widthInMeters / this.product.widthInMeters) * 100 - 100;
    },
    noIssues(): boolean {
      return this.assetSubmission.openIssues.length == 0;
    },
    reviewer(): boolean {
      // Must be an admin and not the product owner
      return this.isAdmin && this.product.artistUserId != this.user.id;
    },
    showSubmitButtons(): boolean {
      return (
        (this.isQa && this.product.job.status.id == JOB_STATUS_TYPE.TECHNICAL_QA) ||
        (this.isClient && this.product.job.status.id == JOB_STATUS_TYPE.CLIENT_QA)
      );
    },
    ...mapState({
      assetSubmission: (state: any) => state.assetSubmission.assetSubmission,
      product: (state: any) => state.product.product,
      user: (state: any) => state.user.user,
    }),
  },
  data: function () {
    return {
      downloading: false,
      errorMessage: '',
      errorMessageSubmit: '',
      loadingApprove: false,
      loadingNeedsRevision: false,
      referenceImageFilename: '',
      renderedImageSrc: 'https://cdn.3xr.com/images/image_not_available.svg',
      submissionStep: 1,
      renderSrc: 'https://cdn.3xr.com/images/image_not_available.svg',
      textureSrc: 'https://cdn.3xr.com/images/image_not_available.svg',
      step: 1,
    };
  },
  methods: {
    approve() {
      if (
        confirm(
          this.isClient
            ? 'Are you sure you want to approve this model? If so, final assets will be generated automatically.'
            : 'Are you sure you want to approve this model? If so, it will be routed to the client for final approval.',
        )
      ) {
        this.loadingApprove = true;
        backend
          .post(this.isClient ? 'submission/approve_client' : 'submission/approve_technical', {
            id: this.assetSubmission.id,
          })
          .then((result) => {
            store.commit.assetSubmission.SET(result.data);
            store.dispatch.product.refresh();
            this.loadingApprove = false;
            this.errorMessageSubmit = '';
          })
          .catch((err) => {
            this.errorMessageSubmit = err;
            this.loadingApprove = false;
          });
      }
    },
    needsRevision() {
      if (
        confirm(
          'Are you sure you want to request revisions to your model? If so, model will be routed back to the artist.',
        )
      ) {
        this.loadingNeedsRevision = true;
        backend
          .post('submission/needs_technical_revision', {
            id: this.assetSubmission.id,
          })
          .then((result) => {
            store.commit.assetSubmission.SET(result.data);
            store.dispatch.product.refresh();
            this.loadingNeedsRevision = false;
            this.errorMessageSubmit = '';
          })
          .catch((err) => {
            this.errorMessageSubmit = err;
            this.loadingNeedsRevision = false;
          });
      }
    },
    showStep(step: number): void {
      this.step = step;
      this.$nextTick(() => {
        // The image-viewer is 100x200 when not visible, this recalculates its size
        window.dispatchEvent(new Event('resize'));
      });
    },
  },
  props: {
    loading: Boolean,
  },
});
</script>

<style lang="scss" scoped>
.white-background {
  background-color: #fff;
  font-weight: bold;
}
.size-ok {
  color: #1eac4d;
}
.size-wrong {
  color: #d82849;
}
</style>
