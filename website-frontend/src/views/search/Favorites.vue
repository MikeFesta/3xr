<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/search/Search.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import backend from '@/services/3xrCom';
import Product from '@/store/interfaces/Product';
import ProductCard from '@/components/product/ProductCard.vue';
import User from '@/store/interfaces/User';
import UserCard from '@/components/user/UserCard.vue';

export default Vue.extend({
  name: 'search-favorties',
  metaInfo: {
    title: 'Favorites | 3XR',
  },
  components: {
    ProductCard,
    UserCard,
  },
  computed: {
    searchString() {
      return 'My Favorites';
    },
  },
  created: function () {
    this.loading = true;
    backend
      .get('search/favorites')
      .then((searchResults) => {
        this.loading = false;
        this.errorMessage = '';
        this.products = [];
        for (let i = 0; i < searchResults.data.length; i++) {
          this.products.push(new Product(searchResults.data[i]));
        }
        this.resultsCount = this.products.length;
      })
      .catch((err) => {
        this.loading = false;
        this.errorMessage = err;
        this.resultsCount = 0;
      });
  },
  data: () => ({
    errorMessage: '',
    loading: false,
    resultsCount: 0,
    artists: [] as User[],
    products: [] as Product[],
  }),
});
</script>

<style lang="scss" scoped>
.grid-left::after {
  content: '';
  flex: auto;
}
</style>
