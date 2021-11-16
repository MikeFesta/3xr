<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/product/ProductCard.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { vuetifyComponents } from '@/plugins/vuetify';
import backend from '@/services/3xrCom';

export default Vue.extend({
  name: 'product-card',
  components: {
    ...vuetifyComponents,
  },
  computed: {
    favorite: {
      get: function (): boolean {
        return this.product.favorites.length > 0;
      },
      set: function (newValue: boolean) {
        backend.post('product/set_favorite', {
          uid: this.product.uid,
          set: newValue,
        });
      },
    },
    hasSubmissions(): boolean {
      return this.asset.submissions.length > 0;
    },
    published(): boolean {
      return this.asset.published;
    },
  },
  props: {
    asset: Object,
    product: Object,
  },
});
</script>

<style lang="scss" scoped>
.product-card {
  display: inline-block;
  margin: 10px;
  width: 300px;
}
.product-thumbnail {
  height: 200px;
}
.button-link {
  width: 100%;
}
</style>
