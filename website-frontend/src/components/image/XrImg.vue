<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/image/XrImg.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { vuetifyComponents } from '@/plugins/vuetify';

export default Vue.extend({
  name: 'xr-img',
  components: {
    ...vuetifyComponents,
  },
  created() {
    this.currentSrc = this.src;
  },
  data: function () {
    return { currentSrc: '' };
  },
  methods: {
    getDefaultImage() {
      return 'https://cdn.3xr.com/images/image_not_available.svg';
    },
    onImageError() {
      this.currentSrc = this.srcFallback ? this.srcFallback : this.getDefaultImage();
    },
  },
  props: {
    alt: {
      type: String,
      default: '',
    },
    aspectRatio: [Number, String],
    className: {
      type: String,
      default: '',
    },
    classNameImg: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: undefined,
    },
    styleDefinition: {
      type: String,
      default: '',
    },
    // Conditional attrs
    isContained: {
      type: Boolean,
      default: undefined,
    },
    // Dimensions
    height: {
      type: [Number, String],
      default: undefined,
    },
    maxHeight: {
      type: [Number, String],
      default: undefined,
    },
    minHeight: {
      type: [Number, String],
      default: undefined,
    },
    width: {
      type: [Number, String],
      default: undefined,
    },
    maxWidth: {
      type: [Number, String],
      default: undefined,
    },
    minWidth: {
      type: [Number, String],
      default: undefined,
    },
    // Src
    src: String,
    srcFallback: {
      type: String,
      default: '',
    },
  },
  watch: {
    src: function (newVal, oldVal) {
      this.currentSrc = newVal;
    },
  },
});
</script>
