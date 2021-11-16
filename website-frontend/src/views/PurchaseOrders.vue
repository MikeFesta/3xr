<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="./PurchaseOrders.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import store from '@/store/index';
import { mapState } from 'vuex';
import DashboardTabs from '@/components/navigation/DashboardTabs.vue';
import PurchaseOrderTable from '@/components/purchase-orders/PurchaseOrderTable.vue';

export default Vue.extend({
  name: 'purchase-orders',
  metaInfo: {
    title: 'Purchase Orders | 3XR',
  },
  components: {
    DashboardTabs,
    PurchaseOrderTable,
  },
  computed: {
    isAdmin: () => store.getters.user.isAdmin,
    ...mapState({
      projects: (state: any) => state.projects.projects,
    }),
  },
  methods: {
    async getProjects() {
      this.loading = true;

      try {
        await store.dispatch.projects.loadPurchaseOrders();
      } catch (err) {
        this.errorMessage = `Unable to load purchase orders. ${err}`;
      } finally {
        this.loading = false;
      }
    },
  },
  watch: {
    '$store.getters.user.role': function (): void {
      this.getProjects();
    },
  },
  created() {
    this.getProjects();
  },
  data: () => ({
    errorMessage: '',
    loading: false,
  }),
});
</script>
