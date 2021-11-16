<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/product/ProductReview.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { vuetifyComponents } from '@/plugins/vuetify';
import { mapState } from 'vuex';
import backend from '@/services/3xrCom';
import AssetDetailsTable from '@/components/asset/AssetDetailsTable.vue';
import { AssetSubmissionInterface } from '@/store/interfaces/AssetSubmission';
import AssetSubmissionDetailsTable from '@/components/asset/AssetSubmissionDetailsTable.vue';
import { ASSET_SUBMISSION_STATUS_TYPE } from '@/store/interfaces/types/AssetSubmissionStatusType';
import AssetSubmissionRender from '@/components/asset/AssetSubmissionRender.vue';
import UnityQaViewer from '@/components/qa/UnityQaViewer.vue';
import QaFeedback from '@/components/qa/QaFeedback.vue';
import QaReviewStepper from '@/components/qa/QaReviewStepper.vue';
import JobDetailsTable from '@/components/job/JobDetailsTable.vue';
import ProductBanner from '@/components/product/ProductBanner.vue';
import ProductDetailsTable from '@/components/product/ProductDetailsTable.vue';
import store from '@/store/index';
import { QaViewerEnum } from '3xr_types/enums';

export default Vue.extend({
  name: 'product-review',
  metaInfo() {
    return {
      title: 'QA Review | ' + this.product.name + ' | 3XR',
    };
  },
  components: {
    ...vuetifyComponents,
    AssetDetailsTable,
    AssetSubmissionDetailsTable,
    AssetSubmissionRender,
    JobDetailsTable,
    ProductBanner,
    ProductDetailsTable,
    QaFeedback,
    QaReviewStepper,
    UnityQaViewer,
  },
  computed: {
    downloadRootUrl(): string {
      return (
        'https://x.3xr.com/x/assets/' +
        this.assetSubmission.asset.uid +
        '/submissions/' +
        this.assetSubmission.submissionNumber +
        '/'
      );
    },
    filteredSubmissions(): Array<AssetSubmissionInterface> {
      return this.asset.submissions.filter((submission: AssetSubmissionInterface) => {
        if (this.isQa) {
          if (submission.status.id != ASSET_SUBMISSION_STATUS_TYPE.SUBMISSION_CANCELED) {
            return true;
          } else {
            return false;
          }
        } else if (this.isClient && !submission.hasReachedClient) {
          return false;
        } else {
          // Admin, Artist, show all
          return true;
        }
      });
    },
    isAdmin: () => store.getters.user.isAdmin,
    isClient: () => store.getters.user.isClient,
    isQa: () => store.getters.user.isQa,
    showDownloads(): boolean {
      // request from Crate & Barrel
      // showing for all clients for now
      return store.getters.user.isClient;
    },
    showUnityViewer: {
      get: function (): boolean {
        return this.user.qaViewer == QaViewerEnum.UNITY || this.unityViewerOverride;
      },
      set: function (newValue: boolean): void {
        this.unityViewerOverride = newValue;
      },
    },
    ...mapState({
      asset: (state: any) => state.asset.asset,
      assetSubmission: (state: any) => state.assetSubmission.assetSubmission,
      product: (state: any) => state.product.product,
      project: (state: any) => state.project.project,
      user: (state: any) => state.user.user,
    }),
  },
  created() {
    // TODO: refactor to make this async
    if (this.uid != this.product.uid || this.product.asset.uid != this.asset.uid) {
      this.loadingProduct = true;
      store.dispatch.product
        .fetchByUid(this.uid)
        .then(() => {
          // Fetch submissions for the asset as a new request
          store.dispatch.asset
            .fetchByUidWithSubmissions(this.product.asset.uid)
            .then(() => {
              if (this.asset.submissions.length > 0) {
                this.selectSubmissionRound(this.asset.submissions.length);
              }
              this.loadingProduct = false;
            })
            .catch((err) => {
              this.errorMessage = 'Unable to load submissions. ' + err;
            });
        })
        .catch((err) => {
          this.errorMessage = 'Unable to load product details. ' + err;
        });
    } else {
      this.selectSubmissionRound(this.asset.submissions.length);
    }
  },
  data: function () {
    return {
      errorMessage: '',
      loadingProduct: false,
      loadingSubmission: false,
      selectedSubmissionRound: 0,
      switch3D: true,
      unityViewerOverride: false,
    };
  },
  methods: {
    masterRenderCompleteCallback(filename: string) {
      // Called when rabbit process has finished generating a render
      this.switch3D = false;
      // Note: the filename is included if we want to select the image
      // in the viewer, however the refresh of the submission data may
      // not yet be complete and the sort order puts the newest at the
      // front anyway, so this is fine for now
    },
    selectSubmissionRound(round: number) {
      if (this.filteredSubmissions.length > 0) {
        // If this round is not in the dropdown, select the first one that is
        let index = 0;
        for (let i = 0; i < this.filteredSubmissions.length; i++) {
          if (this.filteredSubmissions[i].submissionNumber == round) {
            index = i;
          }
        }
        this.selectedSubmissionRound = this.filteredSubmissions[index].submissionNumber;
        this.loadingSubmission = true;
        backend
          .post('/submission/details/', {
            id: this.filteredSubmissions[index].id,
          })
          .then((submissionResult) => {
            store.commit.assetSubmission.SET(submissionResult.data);
            this.loadingSubmission = false;
          })
          .catch((err) => {
            this.errorMessage = 'Unable to load submission';
          });
      }
    },
  },
  props: ['uid'],
});
</script>

<style lang="scss" scoped>
.float-left {
  float: left;
  padding-right: 15px;
  padding-top: 4px;
}
.img-fit {
  max-width: 300px;
  max-height: 300px;
  object-fit: contain;
}
@media (min-width: 1024px) {
  .img-fit {
    max-width: 350px;
    max-height: 350px;
    object-fit: contain;
  }
}
@media (min-width: 1260px) {
  .img-fit {
    max-width: 350px;
    max-height: 350px;
    object-fit: contain;
  }
}
@media (min-width: 1500px) {
  .img-fit {
    max-width: 612px;
    max-height: 612px;
    object-fit: contain;
  }
}
</style>
