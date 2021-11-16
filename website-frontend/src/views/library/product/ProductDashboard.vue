<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/library/product/ProductDashboard.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { vuetifyComponents } from '@/plugins/vuetify';
import LibraryTabs from '@/components/navigation/LibraryTabs.vue';
import { mapState } from 'vuex';
import router from '@/router/index';
import SpinnerButton from '@/components/buttons/SpinnerButton.vue';
import store from '@/store/index';
import XrImg from '@/components/image/XrImg.vue';
import ProductInterface from '@/store/interfaces/Product';

export default Vue.extend({
  name: 'product-library-dashboard',
  metaInfo: {
    title: 'Product Library | 3XR',
  },
  components: {
    LibraryTabs,
    SpinnerButton,
    XrImg,
    ...vuetifyComponents,
  },
  computed: {
    headers() {
      return [
        //{ text: 'Thumbnail', align: 'left', sortable: false, value: 'thumbnail' },
        { text: 'Name', align: 'left', value: 'name' },
        { text: 'UID', align: 'left', value: 'uid' },
        { text: 'Blend Name', align: 'left', value: 'blendName' },
        { text: 'Last Update', align: 'left', value: 'updatedAt' },
      ];
    },
    ...mapState({
      products: (state: any) => state.products.products,
    }),
  },
  created: function () {
    store.dispatch.products.loadAllForAdmin().then((result) => {
      this.loading = false;
    });
  },
  data: () => ({
    errorMessage: '',
    loading: true,
    resultsPerPage: 15,
    searchString: '',
  }),
  methods: {
    viewDetails: function (item: ProductInterface) {
      router.push({ name: 'product-details', params: { uid: item.uid } });
    },
  },
});
</script>
