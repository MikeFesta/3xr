<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/asset/AssetSubmissionTextures.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { vuetifyComponents } from '@/plugins/vuetify';
import ImageViewer from '@/components/image/ImageViewer.vue';

export default Vue.extend({
  name: 'asset-submission-textures',
  components: {
    ...vuetifyComponents,
    ImageViewer,
  },
  computed: {
    textureSrc(): String {
      if (this.assetSubmission.textures.length > 0) {
        return this.assetSubmission.textures[this.selectedIndex].src;
      } else {
        return 'https://cdn.3xr.com/images/image_not_available.svg';
      }
    },
  },
  data: function () {
    return {
      selectedIndex: 0,
      sliderStatus: null,
    };
  },
  props: {
    assetSubmission: { type: Object, required: true },
    loading: Boolean,
    product: { type: Object, required: true },
  },
});
</script>
