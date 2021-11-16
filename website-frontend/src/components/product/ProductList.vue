<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/product/ProductList.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { vuetifyComponents } from '@/plugins/vuetify';

export default Vue.extend({
  name: 'product-list',
  components: {
    ...vuetifyComponents,
  },
  props: {
    loading: Boolean,
    products: Array,
  },
});
</script>

<style lang="scss" scoped>
.note {
  color: #888;
  font-style: italic;
}
</style>
