<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="./BulkUploadCsv.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import store from '@/store/index';
import { mapState } from 'vuex';
import { vuetifyComponents } from '@/plugins/vuetify';
import backend from '@/services/3xrCom';
import DashboardTabs from '@/components/navigation/DashboardTabs.vue';
import ProductDetailsForm from '@/components/product/ProductDetailsForm.vue';
import PurchaseOrderBanner from '@/components/purchase-orders/PurchaseOrderBanner.vue';

export default Vue.extend({
  name: 'purchase-order-bulk-upload-csv',
  metaInfo: {
    title: 'Bulk Upload Purchase Order | 3XR',
  },
  components: {
    ...vuetifyComponents,
    DashboardTabs,
    ProductDetailsForm,
    PurchaseOrderBanner,
  },
  computed: {
    ...mapState({
      project: (state: any) => state.project.project,
    }),
  },
  created() {
    //if (this.project.uid != this.projectUid) { // caching doesn't seem to be working
    this.loadingProject = true;
    backend
      .get('/project/details/' + this.projectUid)
      .then((result) => {
        store.commit.project.SET(result.data);
        this.loadingProject = false;
      })
      .catch((err) => {
        this.errorMessage = 'Unable to load project';
      });
    //}
  },
  data() {
    return {
      errorMessage: '',
      loadingProject: true,
      processing: false,
      successMessage: '',
      uploadProgress: 0,
      uploading: false,
    };
  },
  methods: {
    clearError() {
      this.errorMessage = '';
    },
    sleep(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    async uploadCSV(file: any) {
      this.uploading = true;
      let formData = new FormData();
      formData.append('uid', this.projectUid);
      formData.append('file', file);
      try {
        let uploadResult = await backend.post('project/populate_from_csv', formData, {
          onUploadProgress: (progressEvent: ProgressEvent) => {
            // Note: not showing this anywhere right now
            this.uploadProgress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            if (this.uploadProgress == 100) {
              this.uploading = false;
              this.processing = true;
            }
          },
        });
        this.uploading = false;
        this.processing = false;
        if (uploadResult.status != 200) {
          this.errorMessage =
            uploadResult.data || 'There was a problem processing your csv. Check your data and try again.';
        } else {
          this.successMessage = uploadResult.data + '. Redirecting in 3 seconds.';
          await this.sleep(1000);
          this.successMessage = uploadResult.data + '. Redirecting in 2 seconds.';
          await this.sleep(1000);
          this.successMessage = uploadResult.data + '. Redirecting in 1 second.';
          await this.sleep(1000);
          this.successMessage = '';
          this.$router.push({ name: 'purchase-order-products', params: { projectUid: this.projectUid } });
        }
      } catch (err: any) {
        this.errorMessage = err.message || 'There was a problem processing your csv. Check your data and try again.';
        this.uploading = false;
        this.processing = false;
      }
    },
  },
  props: {
    projectUid: String,
  },
});
</script>
