<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="./ReviewPurchaseOrderModels.pug">
</template>

<script lang="ts">
// TODO: this is currently turned off. It could be used to show the final assets on the purchase order

import Vue from 'vue';
import { vuetifyComponents } from '@/plugins/vuetify';
import { mapState } from 'vuex';
import PurchaseOrderBanner from '@/components/purchase-orders/PurchaseOrderBanner.vue';
import store from '@/store/index';

export default Vue.extend({
  components: {
    ...vuetifyComponents,
    PurchaseOrderBanner,
  },
  computed: {
    ...mapState({
      project: (state: any) => state.project.project,
    }),
  },
  created() {
    if (this.project.uid != this.projectUid) {
      this.loadProject();
    }
  },
  data: () => ({
    errorMessage: '',
    loading: false,
  }),
  methods: {
    async loadProject() {
      try {
        this.loading = true;
        await store.dispatch.project.fetchProjectByUid(this.projectUid);
        this.loading = false;
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
