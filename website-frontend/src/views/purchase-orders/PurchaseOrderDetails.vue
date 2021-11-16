<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="./PurchaseOrderDetails.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import store from '@/store/index';
import { mapState } from 'vuex';
import { vuetifyComponents } from '@/plugins/vuetify';
import DashboardTabs from '@/components/navigation/DashboardTabs.vue';
import PurchaseOrderBanner from '@/components/purchase-orders/PurchaseOrderBanner.vue';
import PurchaseOrderForm from '@/components/purchase-orders/PurchaseOrderForm.vue';

export default Vue.extend({
  name: 'purchase-order-details',
  metaInfo: {
    title: 'Purchase Order Details | 3XR',
  },
  components: {
    ...vuetifyComponents,
    DashboardTabs,
    PurchaseOrderBanner,
    PurchaseOrderForm,
  },
  computed: {
    ...mapState({
      client: (state: any) => state.client.client,
      project: (state: any) => state.project.project,
    }),
  },
  async created() {
    if (this.project.uid != this.projectUid) {
      this.loadingHeader = true;
    }
    this.loadingDetails = true;
    await store.dispatch.project.fetchProjectByUid(this.projectUid);
    this.loadingDetails = false;
    this.loadingHeader = false;
  },
  data: () => ({
    errorMessage: '',
    loadingHeader: false,
    loadingDetails: false,
  }),
  props: {
    projectUid: String,
  },
});
</script>
