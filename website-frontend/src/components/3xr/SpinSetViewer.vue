<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="./SpinSetViewer.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import VueProductSpinner from 'vue-product-spinner';

export default Vue.extend({
  name: 'spin-set-viewer',
  components: {
    VueProductSpinner,
  },
  computed: {
    spinSet(): Array<string> {
      let spins = [];
      for (let i = 0; i < 24; i++) {
        spins.push(
          'https://cdn.3xr.com/models/' +
            this.asset.uid +
            '/spins/' +
            this.asset.name +
            '-512-' + // This could also be 1k or 2k. Note: I tried adjusting based on the element size, but product spinner doesn't like the image array changing
            this.asset.spinSets[0].angle +
            '-' +
            (i * 15).toString().padStart(3, '0') +
            '.jpg',
        );
      }
      return spins;
    },
  },
  props: {
    asset: Object,
    loading: Boolean,
  },
});
</script>

<style lang="scss">
.vue-product-spinner img {
  width: 90%;
  margin-left: 5%;
}
.slider {
  width: 90%;
  margin-left: 5%;
}
</style>
