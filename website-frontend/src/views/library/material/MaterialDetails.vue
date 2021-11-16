<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/library/material/MaterialDetails.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { vuetifyComponents } from '@/plugins/vuetify';
import LibraryTabs from '@/components/navigation/LibraryTabs.vue';
import { mapState } from 'vuex';
import SpinnerButton from '@/components/buttons/SpinnerButton.vue';
import store from '@/store/index';
import MaterialBanner from '@/components/material/MaterialBanner.vue';
import MaterialDetailsTable from '@/components/material/MaterialDetailsTable.vue';
import ProductList from '@/components/product/ProductList.vue';

export default Vue.extend({
  name: 'material-details',
  metaInfo() {
    return {
      title: 'Material Details | ' + this.material.name + ' | 3XR',
    };
  },
  components: {
    LibraryTabs,
    MaterialBanner,
    MaterialDetailsTable,
    ProductList,
    SpinnerButton,
    ...vuetifyComponents,
  },
  computed: {
    ...mapState({
      material: (state: any) => state.material.material,
    }),
  },
  created: async function () {
    await store.dispatch.material.loadByUid(this.uid);
    this.loading = false;
  },
  data: () => ({
    errorMessage: '',
    loading: true,
  }),
  props: ['uid'],
});
</script>

<style lang="scss" scoped>
.banner {
  background-color: #f00;
}
</style>
