<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="./PurchaseOrderBanner.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { vuetifyComponents } from '@/plugins/vuetify';
import { mapState } from 'vuex';

export default Vue.extend({
  name: 'purchase-order-banner',
  components: {
    ...vuetifyComponents,
  },
  computed: {
    ...mapState({
      purchaseOrder: (state: any) => state.project.project,
    }),
  },
  methods: {
    // Purchase order details
    isPODetailsDisabled() {
      return this.disabledTabs.includes(1);
    },
    isPODetailsSelected() {
      return this.activeTab === 1;
    },
    // Products tab
    isProductsDisabled() {
      return this.disabledTabs.includes(2);
    },
    isProductsSelected() {
      return this.activeTab === 2;
    },
    // Models to review
    isModelsToReviewDisabled() {
      return true;
    },
    isModelsToReviewSelected() {
      return this.activeTab === 3;
    },
    // Final assets
    isFinalAssetsDisabled() {
      return true;
    },
    isFinalAssetsSelected() {
      return this.activeTab === 4;
    },
  },
  props: {
    activeTab: Number,
    loading: Boolean,
    disabledTabs: {
      type: Array,
      default() {
        return [];
      },
    },
  },
});
</script>

<style lang="scss" scoped>
.purchase-order-banner {
  max-width: 100%;
  padding: 0;
}
.purchase-order-title {
  font-size: 200%;
  font-weight: bold;
  margin-top: -15px;
}
.purchase-order-tab {
  background-color: #fff;
  border-bottom: solid 4px #4fa0d4;
  color: #000;
  padding: 12px 8px 8px 8px;
  text-align: center;
}
.purchase-order-status {
  background-color: #f5f7fc;
  border-radius: 5px;
  padding-top: 10px;
  padding-bottom: 10px;
}
.purchase-order-tab:hover {
  background-color: #f5f7fc;
  border-bottom: solid 4px #0b82c5;
  cursor: pointer;
}
.purchase-order-tab.is-active {
  background-color: #0b82c5;
  border-bottom-color: #095682;
  color: #fff;
}
.purchase-order-tab.is-disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.purchase-order-top-row {
  display: flex;
  padding: 0;
  margin: 0;
}
.purchase-order-thumbnail {
  border: solid 1px #000;
  background-color: #fff;
  height: 128px;
  width: 128px;
}
</style>
