<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/product/ProductDownloadZip.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { vuetifyComponents } from '@/plugins/vuetify';
import backend from '@/services/3xrCom';
import xBlob from '@/services/xBlob';

export default Vue.extend({
  name: 'product-download-zip',
  components: {
    ...vuetifyComponents,
  },
  data: function () {
    return {
      downloading: false,
      errorMessage: '',
    };
  },
  methods: {
    downloadBlendFile() {
      this.downloading = true;
      backend
        .post('/product/record_zip_download', {
          uid: this.product.uid,
        })
        .then((result) => {
          xBlob
            .get('x/products/' + this.product.uid + '/' + this.product.uid + '.zip')
            .then((result) => {
              this.downloading = false;
              const url = window.URL.createObjectURL(new Blob([result.data]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', this.product.blendName + '.zip');
              document.body.appendChild(link);
              link.click();
            })
            .catch((err) => {
              this.downloading = false;
              this.errorMessage = 'Unable to Download';
            });
        })
        .catch((err) => {
          this.downloading = false;
          this.errorMessage = 'Unable to Download';
        });
    },
  },
  props: {
    product: { type: Object, required: true },
  },
});
</script>
