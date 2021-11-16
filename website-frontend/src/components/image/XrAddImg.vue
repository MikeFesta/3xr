<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/image/XrAddImg.pug">
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';

interface AddImgRefs {
  $refs: {
    uploader: HTMLElement;
  };
}

// Based on: https://codepen.io/blachocolat/pen/BgMKRQ
export default (Vue as VueConstructor<Vue & AddImgRefs>).extend({
  name: 'xr-add-img',
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    imageHeight: {
      type: Number,
      default: 100,
    },
    imageWidth: {
      type: Number,
      default: 100,
    },
    onChangeImage: {
      type: Function,
      default: (files: File[]) => {},
    },
  },
  methods: {
    onButtonClick(): void {
      this.$refs.uploader.click();
    },
    onFileChanged(e: any): void {
      if (this.onChangeImage) {
        this.onChangeImage(e.target.files);
      }
    },
  },
});
</script>

<style lang="scss" >
.xr-add-img-upload-container {
  border: 1px solid #0f6ea6;
  cursor: pointer;
  height: 100px;
  margin-right: 5px;
  position: relative;
  width: 100px;
  .vertical-center {
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #0f6ea6;
    .v-icon {
      color: #0f6ea6;
      font-size: 50px;
    }
  }
}
</style>