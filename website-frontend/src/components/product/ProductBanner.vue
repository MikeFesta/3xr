<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/product/ProductBanner.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import ProductDownloadZip from '@/components/product/ProductDownloadZip.vue';
import { mapState } from 'vuex';
import store from '@/store/index';
import backend from '@/services/3xrCom';

export default Vue.extend({
  name: 'product-banner',
  components: {
    ProductDownloadZip,
  },
  computed: {
    favorite: {
      get: function (): boolean {
        return this.product.favorites?.length > 0 || false;
      },
      set: function (newValue: boolean) {
        backend.post('product/set_favorite', {
          uid: this.product.uid,
          set: newValue,
        });
      },
    },
    isAdmin: () => store.getters.user.isAdmin,
    isClient: () => store.getters.user.isClient,
    ...mapState({
      asset: (state: any) => state.asset.asset,
      product: (state: any) => state.product.product,
    }),
  },
  props: {
    activeTab: Number,
    loading: Boolean,
  },
});
</script>

<style lang="scss" scoped>
.admin-info {
  color: #888;
}
.product-banner {
  color: #000;
  max-width: 100%;
  padding: 0;
}
.product-title {
  font-size: 24px;
  font-weight: bold;
  margin-top: 0px;
  text-transform: uppercase;
}
.product-tab,
.product-tab-active {
  color: #000;
  padding: 4px;
  margin-top: -15px;
}
.product-tab {
  background-color: #ffffff80;
  border-bottom: solid 4px #dda349;
}
.product-tab:hover {
  background-color: #ffffffd0;
  border-bottom: solid 4px #dda349;
  cursor: pointer;
}
.product-tab-active {
  background-color: #0b82c5;
  border-bottom: solid 4px #095682;
  color: #fff;
}
.product-top-row {
  display: flex;
  padding: 0;
  margin: 0;
}
.product-thumbnail {
  height: 100px;
  width: 100px;
  object-fit: cover;
  border: #0b82c5 solid 2px;
  float: left;
  margin-right: 10px;
}
</style>
