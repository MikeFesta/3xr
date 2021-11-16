<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/product/ProductDetails.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import store from '@/store/index';
import { mapState } from 'vuex';
import JobDetailsTable from '@/components/job/JobDetailsTable.vue';
import ProductAdditionalFileManager from '@/components/product/ProductAdditionalFileManager.vue';
import ProductBanner from '@/components/product/ProductBanner.vue';
import ProductDetailsForm from '@/components/product/ProductDetailsForm.vue';
import ProductDetailsTable from '@/components/product/ProductDetailsTable.vue';
import ProductImageViewer from '@/components/product/ProductImageViewer.vue';
import ProductLinkedMaterials from '@/components/product/ProductLinkedMaterials.vue';
import ProductLinkedParts from '@/components/product/ProductLinkedParts.vue';
import { ProductReferenceImageInterface } from '@/store/interfaces/ProductReferenceImage';
import Part from '@/store/interfaces/Part';
import PartSlot from '@/store/interfaces/PartSlot';

export default Vue.extend({
  name: 'product-details',
  metaInfo() {
    return {
      title: 'Product Details | ' + this.product.name + ' | 3XR',
    };
  },
  components: {
    JobDetailsTable,
    ProductAdditionalFileManager,
    ProductBanner,
    ProductDetailsForm,
    ProductDetailsTable,
    ProductImageViewer,
    ProductLinkedMaterials,
    ProductLinkedParts,
  },
  computed: {
    isAdmin: () => store.getters.user.isAdmin,
    ...mapState({
      client: (state: any) => state.client.client, // needed for edit form
      job: (state: any) => state.job.job, // needed for edit form
      isJobPendingReview: function (): boolean {
        return store.getters.job.isPendingReview(this.job);
      },
      product: (state: any) => state.product.product,
      user: (state: any) => state.user.user,
      project: (state: any) => state.project.project,
    }),
    allPartSlots: function () {
      let slots: String[] = [];
      this.product.parts.forEach((part: Part) => {
        part.slots.forEach((slot: PartSlot) => {
          slots.push(slot.slotName);
        });
      });
      return slots;
    },
  },
  watch: {
    '$route.params.uid': function () {
      this.updateState();
    },
  },
  created() {
    this.init();
  },
  methods: {
    clearMessages(): void {
      this.errorMessage = '';
    },
    async init() {
      this.loadingJob = true;
      this.loadingProduct = true;
      store.commit.product.CLEAR();
      try {
        await store.dispatch.product.fetchByUid(this.uid);
        const jobUid = store.state.product.product.job.uid;
        if (store.state.product.product.asset.uid) {
          await store.dispatch.asset.fetchByUidWithSubmissions(store.state.product.product.asset.uid);
        }
        this.loadingProduct = false;

        await store.dispatch.job.fetchByUid(jobUid);
        const clientId = store.state.job.job.clientId;
        this.loadingJob = false;

        if (clientId) {
          this.loadingClient = true;
          await store.dispatch.client.getDetailsById(clientId);
          this.loadingClient = false;
        }
      } catch (err) {
        this.loadingProduct = true;
        this.loadingJob = false;
        this.loadingClient = false;
        this.errorMessage = 'Unable to load product. ' + err;
      }
    },
    async updateState() {
      if (this.uid !== this.product.uid) {
        try {
          this.loadingProduct = true;
          const product = await store.dispatch.product.fetchByUid(this.uid);
          this.loadingProduct = false;

          this.loadingJob = true;
          const job = await store.dispatch.job.fetchByUid(this.product.job.uid);
          this.loadingJob = false;

          this.loadingClient = true;
          const client = await store.dispatch.client.getDetailsById(this.job.clientId);
          this.loadingClient = false;
        } catch (err) {
          this.errorMessage = `Unable to load product. ${err}`;
        }
      }
    },
    async setPrimaryImage(image: ProductReferenceImageInterface) {
      await store.dispatch.product.updatePrimaryReferenceImage({
        uid: this.job.product.uid,
        primaryImageId: image.id,
      });
    },
    async removeImage(image: ProductReferenceImageInterface) {
      if (confirm(`Do you really want to delete ${image.filename} ?`)) {
        await store.dispatch.product.deleteReferenceImage({
          uid: this.job.product.uid,
          imageId: image.id,
        });
      }
    },
    async uploadImages(files: File[]) {
      const isSuccess = await store.dispatch.product.uploadProductReferenceImage(files);
      if (isSuccess) {
        this.clearMessages();
      } else {
        this.errorMessage = 'Upload Failed';
      }
    },
  },
  data: function () {
    return {
      errorMessage: '',
      downloading: false,
      loadingClient: false,
      loadingJob: false,
      loadingProduct: false,
      polling: 0,
    };
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
  props: {
    uid: {
      type: String,
    },
    withBanner: {
      type: Boolean,
      default: true,
    },
    productTableEditEnabled: {
      type: String,
      default: 'false',
    },
  },
});
</script>

<style lang="scss" scoped>
.reviewer-icon {
  color: #fff;
  padding-right: 10px;
}
.icon-bar {
  width: 100%;
  padding-left: 20px;
}
.v-expansion-panels > *:first-child {
  border-radius: 0px;
}
</style>
