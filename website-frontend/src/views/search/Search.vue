<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/search/Search.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import backend from '@/services/3xrCom';
import Product from '@/store/interfaces/Product';
import ProductCard from '@/components/product/ProductCard.vue';

export default Vue.extend({
  name: 'search-all',
  metaInfo: {
    title: 'Search | 3XR',
  },
  components: {
    ProductCard,
  },
  computed: {
    searchString() {
      // This computed property runs when the string changes, so also update the results
      this.search(this.$route.query.q);
      return this.$route.query.q;
    },
  },
  data: () => ({
    errorMessage: '',
    loading: false,
    resultsCount: 0,
    products: [] as Product[],
  }),
  methods: {
    search: async function (query: any) {
      this.loading = true;
      const productResults = await backend.post('search/products', { query: query });
      this.loading = false;
      this.products = [];
      if (!productResults) {
        this.errorMessage = 'No results found';
      } else {
        for (let i = 0; i < productResults.data.length; i++) {
          this.products.push(new Product(productResults.data[i]));
        }
      }
      this.resultsCount = this.products.length;
    },
  },
});
</script>

<style lang="scss" scoped>
.grid-left::after {
  content: '';
  flex: auto;
}
.inline {
  display: inline;
}
</style>
