<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/product/ProductAdditionalFileManager.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import store from '@/store/index';
import { ProductAdditionalFileInterface } from '@/store/interfaces/ProductAdditionalFile';

export default Vue.extend({
  name: 'product-additional-file-manager',
  computed: {
    ...mapState({
      uploadingFile: (state: any) => state.product.isUploadingFile,
      uploadProgress: (state: any) => state.product.uploadProgress,
      product: (state: any) => state.product.product,
    }),
    sortedAdditionalFiles(): ProductAdditionalFileInterface[] {
      return this.product.additionalFiles
        .slice()
        .sort((a: ProductAdditionalFileInterface, b: ProductAdditionalFileInterface) =>
          a.filename > b.filename ? 1 : -1,
        );
    },
  },
  data() {
    return {
      errorMessage: '',
      isEditEnabled: true,
    };
  },
  methods: {
    async uploadFiles(files: File[]): Promise<void> {
      const isSuccess = await store.dispatch.product.uploadProductAdditionalFiles(files);
      if (isSuccess) {
        this.clearMessages();
      } else {
        this.errorMessage = 'Upload Failed';
      }
    },
    clearMessages(): void {
      this.errorMessage = '';
    },
    setUploadProgressPercent(progressPercent: number): void {
      this.uploadProgress = progressPercent;
    },
    async removeAdditionalFile(additionalFileId: number, filename: string): Promise<void> {
      if (confirm(`Do you really want to delete "${filename}"?`)) {
        await store.dispatch.product.deleteAdditionalFile({
          uid: this.product.uid,
          additionalFileId: additionalFileId,
        });
        await store.dispatch.job.refresh();
      }
    },
  },
});
</script>
