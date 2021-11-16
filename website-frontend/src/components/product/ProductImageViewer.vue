<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/product/ProductImageViewer.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import ImageViewer from '@/components/image/ImageViewer.vue';
import { ProductReferenceImageInterface } from '@/store/interfaces/ProductReferenceImage';

export default Vue.extend({
  name: 'product-image-viewer',
  components: {
    ImageViewer,
  },
  props: {
    product: { type: Object, required: true },
    loading: Boolean,
    showSecondaryImageStar: {
      type: Boolean,
      default: false,
    },
    showImageUploader: {
      type: Boolean,
      default: false,
    },
    onChangeImage: {
      type: Function,
      default: (file: File[]) => {},
    },
    showRemoveImage: {
      type: Boolean,
      default: false,
    },
    onClickImage: {
      type: Function,
      default: (image: ProductReferenceImageInterface) => {},
    },
    onClickRemove: {
      type: Function,
      default: (image: ProductReferenceImageInterface) => {},
    },
    onClickSecondaryStar: {
      type: Function,
      default: (image: ProductReferenceImageInterface) => {},
    },
  },
});
</script>
