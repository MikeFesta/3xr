<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/asset/AssetDetails.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { vuetifyComponents } from '@/plugins/vuetify';
import { mapState } from 'vuex';
import backend from '@/services/3xrCom';
import AssetDetailsTable from '@/components/asset/AssetDetailsTable.vue';
import { FILE_TYPE } from '@/store/interfaces/types/FileType';
import ImageViewer from '@/components/image/ImageViewer.vue';
import ProductBanner from '@/components/product/ProductBanner.vue';
import QrCode from '@/components/3xr/QrCode.vue';
import RabbitButton from '@/components/buttons/RabbitButton.vue';
import store from '@/store/index';
import SpinSetViewer from '@/components/3xr/SpinSetViewer.vue';
import XrModelViewer from '@/components/3xr/XrModelViewer.vue';
import AssetFile from '@/store/interfaces/AssetFile';
import Image, { ImageInterface } from '@/store/interfaces/common/Image';
import { MetaInfo } from 'vue-meta'; // Interesting this was needed in this file, but not in others also returning metaInfo()

export default Vue.extend({
  name: 'asset-details',
  metaInfo(): MetaInfo {
    return {
      title: 'Final Asset | ' + this.asset.name + ' | 3XR',
    };
  },
  components: {
    ...vuetifyComponents,
    AssetDetailsTable,
    ImageViewer,
    ProductBanner,
    QrCode,
    RabbitButton,
    SpinSetViewer,
    XrModelViewer,
  },
  computed: {
    embedCode(): string {
      return (
        '<iframe height="' +
        this.embedHeight +
        '" width="' +
        this.embedWidth +
        '" src="https://embed.3xr.com/' +
        this.asset.uid +
        '?bg=' +
        this.embedColor +
        '" frameborder="0"></iframe>'
      );
    },
    hasSpinSet(): boolean {
      return this.asset.spinSets.length > 0;
    },
    isAdmin: () => store.getters.user.isAdmin,
    modelGlb(): AssetFile {
      return this.asset.files
        .filter((file: AssetFile) => {
          return file.typeId == FILE_TYPE.MODEL_GLB;
        })
        .pop();
    },
    modelUsdz(): AssetFile {
      return this.asset.files
        .filter((file: AssetFile) => {
          return file.typeId == FILE_TYPE.MODEL_USDZ;
        })
        .pop();
    },
    cbZip(): AssetFile {
      return this.asset.files
        .filter((file: AssetFile) => {
          return file.typeId == FILE_TYPE.CRATE_AND_BARREL_ZIP;
        })
        .pop();
    },
    qrImageSrc(): string {
      const qrCodeFile = this.asset.files
        .filter((file: AssetFile) => {
          return file.typeId == FILE_TYPE.QR;
        })
        .map((file: AssetFile) => {
          return file.getUrl(this.asset.uid);
        });
      if (qrCodeFile.length > 0) {
        let selectedIndex = 0;
        for (let i = 0; i < qrCodeFile.length; i++) {
          // show the 3xr branded png by default
          if (qrCodeFile[i].endsWith('qr-' + this.asset.name + '.png')) {
            selectedIndex = i;
          }
        }
        return qrCodeFile[selectedIndex];
      } else {
        return '';
      }
    },
    qrZipSrc(): string {
      const qrCodeFile = this.asset.files
        .filter((file: AssetFile) => {
          return file.typeId == FILE_TYPE.QR_ZIP;
        })
        .map((file: AssetFile) => {
          return file.getUrl(this.asset.uid);
        });
      if (qrCodeFile.length > 0) {
        return qrCodeFile[0];
      } else {
        return '';
      }
    },
    renders(): Array<ImageInterface> {
      const matchingFiles = this.asset.files
        .filter((file: AssetFile) => {
          return file.typeId == (FILE_TYPE.RENDER_PNG || FILE_TYPE.RENDER_JPG);
        })
        .map((file: AssetFile) => {
          return new Image({
            alt: file.filename,
            src: file.getUrl(this.asset.uid),
          });
        });
      if (matchingFiles.length == 0) {
        return [new Image(null)];
      } else {
        return matchingFiles;
      }
    },
    ...mapState({
      asset: (state: any) => state.asset.asset,
      product: (state: any) => state.product.product,
      user: (state: any) => state.user.user,
      project: (state: any) => state.project.project,
    }),
  },
  async created() {
    if (this.uid != this.asset.uid) {
      this.loadingAsset = true;
      // TODO: need to have a nested product class on asset to get the uid, which is not currently set up
      //await store.dispatch.asset.fetchByUidWithSubmissions(this.uid);
      const asset = await backend.post('/asset/asset_details_with_submissions', { uid: this.uid });
      store.commit.asset.SET(asset.data);
      this.loadingAsset = false;
      this.loadingProduct = true;
      await store.dispatch.product.fetchByUid(asset.data.product.uid);
      this.loadingProduct = false;
    }
    // Note: we may want to re-load asset data for this page in case state.asset does not have all needed data
  },
  data: function () {
    return {
      copyError: false,
      dialog: false,
      dialog2: false,
      dialog3: false,
      embedColor: 'ffffff',
      embedHeight: 600,
      embedWidth: 800,
      dropdown: ['Renderings', 'Blender File', 'Web Files', 'All Assets'],
      errorMessage: '',
      loadingAsset: false,
      loadingProduct: false,
    };
  },
  methods: {
    copyCode() {
      this.copyError = false;
      const codeArea = document.getElementById('codeArea') as HTMLTextAreaElement;
      if (codeArea) {
        codeArea.disabled = false;
        codeArea.select();
        try {
          if (document.execCommand('copy')) {
            const messageDiv = document.getElementById('copySuccessMessage') as HTMLDivElement;
            if (messageDiv) {
              messageDiv.style.opacity = '1';
            }
            setTimeout(this.dismissMessages, 1500);
          } else {
            this.copyError = true;
          }
        } catch (err) {
          this.copyError = true;
        }
        codeArea.disabled = true;
      }
    },
    dismissMessages() {
      const messageDiv = document.getElementById('copySuccessMessage') as HTMLDivElement;
      if (messageDiv) {
        messageDiv.style.opacity = '0';
      }
    },
    renderCompleteCallback(filename: string) {
      store.dispatch.asset.refresh();
    },
    spinSetCompleteCallback(filename: string) {
      store.dispatch.asset.refresh();
    },
    selectColor(color: any) {
      this.embedColor = color.target.value.substr(1);
    },
  },
  props: ['uid'],
});
</script>

<style lang="scss" scoped>
.code {
  background-color: #f5f7fc;
  color: #333333;
  font-family: monospace;
  height: 100px;
  width: 100%;
}
.no-spins {
  border: solid 1px #000;
  background-color: #ededed;
  margin: 5px;
  padding: 20px;
  text-align: center;
}
.share {
  background-color: #f5f7fc;
  color: #333333;
  font-family: monospace;
  height: auto;
  width: 100%;
}
.fade {
  opacity: 0;
  transition: opacity 500ms;
}
.full-width {
  width: 90%;
}
</style>
