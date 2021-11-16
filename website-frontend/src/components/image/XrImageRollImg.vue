<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/image/XrImageRollImg.pug">
</template>

<script lang="ts">
import { ImageInterface } from '@/store/interfaces/common/Image';
import XrImg from '@/components/image/XrImg.vue';
import { ProductReferenceImageInterface } from '@/store/interfaces/ProductReferenceImage';
import Vue, { PropType } from 'vue';

export default Vue.extend({
  name: 'xr-image-roll-img',
  components: {
    XrImg,
  },
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    image: Object as PropType<ImageInterface[]>,
    imageHeight: {
      type: Number,
      default: 100,
    },
    imageWidth: {
      type: Number,
      default: 100,
    },
    showPrimaryImageStar: {
      type: Boolean,
      default: false,
    },
    showSecondaryImageStar: {
      type: Boolean,
      default: false,
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

<style lang="scss">
.status-star {
  background-color: #fff;
  border-radius: 25px;
  left: 20px;
  position: absolute;
  top: -85px;
  z-index: 10;
}
.image-wraper {
  display: inline-block;
  position: relative;
  .selected {
    border: solid 1px#0b82c5;
    -webkit-box-shadow: 0px 0px 5px -1px rgba(11, 129, 197, 1);
    -moz-box-shadow: 0px 0px 5px -1px rgba(11, 129, 197, 1);
    box-shadow: 0px 0px 5px -1px rgba(11, 129, 197, 1);
  }
  .unselected {
    border: solid 1px #000;
    cursor: pointer;
  }
  .close-icon {
    position: absolute;
    bottom: 0;
    right: 0;
  }
  .mdi-close-circle {
    background-color: #fff;
    border-radius: 25px;
    left: 0px;
  }
  .primary-img-flag {
    cursor: pointer;
    left: 10px;
    position: absolute;
    top: -8px;
    z-index: 100;
  }
}
</style>