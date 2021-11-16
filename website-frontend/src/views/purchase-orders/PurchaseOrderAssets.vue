<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="./PurchaseOrderAssets.pug">
</template>

<script lang="ts">
// Note: Not currently in use
import Vue from 'vue';
import { vuetifyComponents } from '@/plugins/vuetify';
import { mapState } from 'vuex';
import PurchaseOrderBanner from '@/components/purchase-orders/PurchaseOrderBanner.vue';
import store from '@/store/index';

export default Vue.extend({
  name: 'purchase-order-assets',
  metaInfo: {
    title: 'Final Assets for Purchase Order | 3XR',
  },
  components: {
    ...vuetifyComponents,
    PurchaseOrderBanner,
  },
  computed: {
    ...mapState({
      project: (state: any) => state.project.project,
    }),
  },
  async created() {
    if (this.project.uid != this.projectUid) {
      this.loading = true;
      await this.loadProject();
      this.loading = false;
    }
  },
  data: () => ({
    errorMessage: '',
    loading: true,
  }),
  methods: {
    async loadProject() {
      try {
        await store.dispatch.project.fetchProjectByUid(this.projectUid);
      } catch (err) {
        this.errorMessage = 'Unable to load Purchase Order. ' + err;
      }
    },
  },
  props: {
    projectUid: String,
  },
});
</script>
