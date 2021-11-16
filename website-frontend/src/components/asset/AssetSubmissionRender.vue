<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/asset/AssetSubmissionRender.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { vuetifyComponents } from '@/plugins/vuetify';
import ImageViewer from '@/components/image/ImageViewer.vue';
import { mapState } from 'vuex';
import QaModelViewer from '@/components/qa/QaModelViewer.vue';
import store from '@/store/index';

export default Vue.extend({
  name: 'asset-submission-render',
  components: {
    ...vuetifyComponents,
    ImageViewer,
    QaModelViewer,
  },
  computed: {
    isClient: () => store.getters.user.isClient,
    renders(): Array<any> {
      let r = [];
      if (this.assetSubmission.submissionNumber > 0) {
        for (let i = 0; i < this.assetSubmission.renders.length; i++) {
          r.push({
            alt: this.assetSubmission.renders[i].filename,
            src:
              'https://x.3xr.com/x/assets/' +
              this.product.asset.uid +
              '/submissions/' +
              this.assetSubmission.submissionNumber +
              '/' +
              this.assetSubmission.renders[i].filename,
          });
        }
      }
      return r;
    },
    view3d(): boolean {
      if (!this.view3dClicked) {
        // Initial load, show based on status id
        if (this.assetSubmission.status.id > 11) {
          return true;
        }
        return false;
      } else {
        // return user click
        return this.view3dValue;
      }
    },
    ...mapState({
      product: (state: any) => state.product.product,
    }),
  },
  data: () => ({
    renderSrc: 'https://cdn.3xr.com/images/image_not_available.svg',
    view3dClicked: false,
    view3dValue: false,
  }),
  props: {
    assetSubmission: {
      type: Object,
      required: true,
    },
    loading: Boolean,
    masterRenderCompleteCallback: Function,
    show3D: Boolean,
  },
});
</script>
