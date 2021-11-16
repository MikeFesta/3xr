<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="./AddProduct.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { vuetifyComponents } from '@/plugins/vuetify';
import { mapState } from 'vuex';
import backend from '@/services/3xrCom';
import ProductDetailsForm from '@/components/product/ProductDetailsForm.vue';
import PurchaseOrderBanner from '@/components/purchase-orders/PurchaseOrderBanner.vue';
import store from '@/store/index';

export default Vue.extend({
  name: 'add-product',
  metaInfo: {
    title: 'Add Product | 3XR',
  },
  components: {
    ...vuetifyComponents,
    ProductDetailsForm,
    PurchaseOrderBanner,
  },
  computed: {
    ...mapState({
      client: (state: any) => state.client.client,
      job: (state: any) => state.job.job,
      project: (state: any) => state.project.project,
    }),
  },
  created() {
    store.commit.job.CLEAR();
    if (!this.client?.uid) {
      store.dispatch.client.fetchClient();
    }
    if (this.project.uid != this.projectUid) {
      this.loading = true;
      backend
        .get('/project/details/' + this.projectUid)
        .then((result) => {
          store.commit.project.SET(result.data);
          this.loading = false;
        })
        .catch((err) => {
          this.errorMessage = 'Unable to load project';
        });
    }
  },
  data() {
    return {
      errorMessage: '',
      loading: false,
    };
  },
  props: {
    projectUid: String,
  },
});
</script>
