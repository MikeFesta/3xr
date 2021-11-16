<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="./BulkUploadZip.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import store from '@/store/index';
import { mapState } from 'vuex';
import { vuetifyComponents } from '@/plugins/vuetify';
import backend from '@/services/3xrCom';
import x from '@/services/x';
import DashboardTabs from '@/components/navigation/DashboardTabs.vue';
import ProductDetailsForm from '@/components/product/ProductDetailsForm.vue';
import PurchaseOrderBanner from '@/components/purchase-orders/PurchaseOrderBanner.vue';

export default Vue.extend({
  name: 'purchase-order-bulk-upload-zip',
  metaInfo: {
    title: 'Bulk Upload Images and Resources | 3XR',
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
    async uploadZip(file: any) {
      this.uploading = true;
      let formData = new FormData();
      formData.append('uid', this.projectUid);
      formData.append('file', file);
      try {
        this.uploadProgress = 0; // reset the counter
        let uploadResult = await x.post('upload/project_resources_zip', formData, {
          onUploadProgress: (progressEvent: ProgressEvent) => {
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
            uploadResult.data || 'There was a problem processing your zip. Check your data and try again.';
        } else {
          this.successMessage = 'Your file has been uploaded. It may take a few minutes for all files to appear.';
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
