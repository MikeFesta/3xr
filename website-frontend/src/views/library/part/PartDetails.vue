<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/library/part/PartDetails.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { vuetifyComponents } from '@/plugins/vuetify';
import LibraryTabs from '@/components/navigation/LibraryTabs.vue';
import { mapState } from 'vuex';
import SpinnerButton from '@/components/buttons/SpinnerButton.vue';
import store from '@/store/index';
import PartBanner from '@/components/part/PartBanner.vue';
import PartDetailsTable from '@/components/part/PartDetailsTable.vue';
import ProductList from '@/components/product/ProductList.vue';

export default Vue.extend({
  name: 'part-details',
  metaInfo() {
    return {
      title: 'Part Details | ' + this.part.name + ' | 3XR',
    };
  },
  components: {
    LibraryTabs,
    PartBanner,
    PartDetailsTable,
    ProductList,
    SpinnerButton,
    ...vuetifyComponents,
  },
  computed: {
    ...mapState({
      part: (state: any) => state.part.part,
    }),
  },
  created: async function () {
    await store.dispatch.part.loadByUid(this.uid);
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
