<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="./NewPurchaseOrder.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import store from '@/store/index';
import DashboardTabs from '@/components/navigation/DashboardTabs.vue';
import PurchaseOrderForm from '@/components/purchase-orders/PurchaseOrderForm.vue';

export default Vue.extend({
  name: 'purchase-orders-new',
  metaInfo: {
    title: 'New Purchase Order | 3XR',
  },
  components: {
    DashboardTabs,
    PurchaseOrderForm,
  },
  async created() {
    this.loading = true;
    await store.dispatch.projectHoldings.fetchProjectHolding();
    await store.dispatch.project.setNewDefaults();
    this.loading = false;
  },
  data: function () {
    return {
      loading: false,
    };
  },
});
</script>
