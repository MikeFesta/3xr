<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/product/ProductDetailsTable.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapState } from 'vuex';
import XrInlineTextareafield from '@/components/forms/XrInlineTextareafield.vue';
import XrInlineTextfield from '@/components/forms/XrInlineTextfield.vue';
import XrInlineNumberfield from '@/components/forms/XrInlineNumberfield.vue';
import ProductDimensions from '@/components/product/ProductDimensions.vue';
import RabbitButton from '@/components/buttons/RabbitButton.vue';
import store, { RootState } from '@/store/index';
import { JOB_QUALITY_TYPE } from '@/store/interfaces/types/JobQualityType';
import { JOB_PRIORITY_TYPE } from '@/store/interfaces/types/JobPriorityType';
import { JobInterface, JobUpdateInterface } from '@/store/interfaces/Job';
import { ProductDetailsTableData, ProductData } from '@/components/product/ProductDetailsTable.types';
import router from '@/router';

export default Vue.extend({
  name: 'product-details-table',
  components: {
    ProductDimensions,
    RabbitButton,
    XrInlineNumberfield,
    XrInlineTextfield,
    XrInlineTextareafield,
  },
  data() {
    return {
      saving: false,
      isEditEnabled: false,
      errorMessage: '',
      successMessage: '',
      input: {
        asin: '',
        brandId: 0,
        classId: 0,
        dateDue: '',
        dimensions: {
          additional: '',
          depth: undefined,
          height: undefined,
          width: undefined,
          unitTypeId: 0,
        },
        materialInformation: '',
        modelingInstructions: '',
        name: '',
        notes: '',
        partNumber: '',
        projectUid: '',
        price: 0,
        priority: 0,
        quality: 0,
        studioId: 0,
        url: '',
        blendName: '',
        uid: '',
      },
    } as ProductDetailsTableData;
  },
  async created() {
    if (this.$route.params.uid) {
      if (this.product.job) {
        await store.dispatch.job.fetchByUid(this.product.job.uid);
      }
    }
    if (this.isAdmin) {
      store.dispatch.artists.loadAllForAdmin();
    }

    if (this.editEnabled) {
      this.toggleEdit();
    }
    this.loadDefaults();
  },
  computed: {
    ...mapGetters('artists', ['artistFilter']),
    ...mapState({
      artists(state: RootState) {
        return state.artists.artists;
      },
      client: (state: RootState) => state.client.client,
      job: (state: RootState) => state.job.job,
      pickList: (state: RootState) => state.pickList.pickList,
      product: (state: RootState) => state.product.product,
      user: (state: RootState) => state.user.user,
    }),
    isAdmin: () => store.getters.user.isAdmin,
    isAbleToEditTable: () => {
      const user = store.getters.user;
      return user.isAdmin || user.isClient;
    },
    initProductData(): ProductData {
      return {
        depth: this.product.depth || 0,
        height: this.product.height || 0,
        name: this.product.blendName || '',
        product_uid: this.product.uid,
        unit_type: this.product.units.name,
        width: this.product.width || 0,
      };
    },
    productPartMaterialData(): any {
      // Note: part + material slots should match, but code is not currently enforcing that
      let partName = '';
      let partUid = '';
      if (this.product.parts.length > 0) {
        partName = this.product.parts[0].blendName;
        partUid = this.product.parts[0].uid;
      }
      let materialSlots = '';
      let materialUids = '';
      let materialNames = '';
      let materialBlendModes = '';
      if (this.product.materials.length > 0) {
        this.product.materials.forEach((material) => {
          materialSlots = materialSlots + (materialSlots.length > 0 ? ',' : '') + material.productMaterial.slotName;
          materialNames = materialNames + (materialNames.length > 0 ? ',' : '') + material.blendName;
          materialUids = materialUids + (materialUids.length > 0 ? ',' : '') + material.uid;
          materialBlendModes = materialBlendModes + (materialBlendModes.length > 0 ? ',' : '') + material.blendMode;
        });
      }
      return {
        productName: this.product.blendName,
        productUid: this.product.uid,
        partName,
        partUid,
        materialSlots,
        materialUids,
        materialNames,
        materialBlendModes,
      };
    },
    unitTypeName(): string {
      return this.pickList.units.find((unit) => unit.id === this.input.dimensions.unitTypeId)?.name || '';
    },
    productBrand: {
      get(): number {
        return this.input.brandId;
      },
      async set(brandId: number): Promise<void> {
        const currentJob = this.getJobFromLocalState();
        await store.dispatch.job.createOrUpdateJob({ ...currentJob, brandId });
        await store.dispatch.product.refresh();
      },
    },
    productBrandName(): string {
      return this.client.brands.find((brand) => brand.id === this.input.brandId)?.name || this.job.brand.name;
    },
    productClass: {
      get(): number {
        return this.input.classId;
      },
      async set(classId: number): Promise<void> {
        const currentJob = this.getJobFromLocalState();
        await store.dispatch.job.createOrUpdateJob({ ...currentJob, classId });
        await store.dispatch.product.refresh();
      },
    },
    productClassName(): string {
      return this.client.classes.find((cls) => cls.id === this.input.classId)?.name || this.job.class.name;
    },
    priorityName(): string {
      return this.pickList.jobPriority.find((priority) => priority.id === this.input.priority)?.name || '';
    },
  },
  watch: {
    job(newValue, oldValue): void {
      this.loadDefaults();
    },
  },
  methods: {
    isJobPendingReview(job: JobInterface): boolean {
      return store.getters.job.isPendingReview(this.job);
    },
    isJobUnassigned(job: JobInterface): boolean {
      return store.getters.job.isJobUnassigned(job);
    },
    clearMessages(): void {
      this.errorMessage = '';
      this.successMessage = '';
    },
    loadDefaults(): void {
      if (this.job.uid) {
        if (this.job.brand && this.job.brand.id > 0) {
          this.input.brandId = this.job.brand.id;
        }
        if (this.job.class && this.job.class.id > 0) {
          this.input.classId = this.job.class.id;
        }
        this.input.blendName = this.job.product.blendName || '';
        this.input.name = this.job.product.name;
        this.input.partNumber = this.job.product.partNumber;
        this.input.price = this.job.price;
        this.input.asin = this.job.product.asin || '';
        this.input.url = this.job.product.url;
        this.input.quality = this.job.quality ? this.job.quality.id : JOB_QUALITY_TYPE.STANDARD;

        //@ts-ignore is type or implementation wrong?
        this.input.priority = this.job.priority ? this.job.priority.id : JOB_PRIORITY_TYPE.STANDARD;
        this.input.dateDue = this.job.dateDue;
        this.input.notes = this.job.notes;

        this.input.dimensions.unitTypeId = this.job.product.units.id;
        this.input.dimensions.height = this.job.product.height;
        this.input.dimensions.width = this.job.product.width;
        this.input.dimensions.depth = this.job.product.depth;

        this.input.dimensions.additional = this.job.additionalDimensions;
        this.input.materialInformation = this.job.materialInformation;
        this.input.modelingInstructions = this.job.modelingInstructions;
        this.input.projectUid = this.job.project.uid;

        this.input.studioId = this.job.studio.id;

        this.input.uid = this.job.product.uid;
      }
    },
    setIsEditEnabled(): void {
      this.isEditEnabled = false;
    },
    toggleEdit(): void {
      this.clearMessages();
      this.isEditEnabled = !this.isEditEnabled;
      if (this.isEditEnabled) {
        // When editing, we need client info for Class / Brand picklists
        store.dispatch.client.getDetailsById(this.job.clientId || 0);
      }
    },
    async submitForm(): Promise<void> {
      if (this.validateForm()) {
        const jobData = this.getJobFromLocalState();
        const isJobPendingReview = store.getters.job.isPendingReview(this.job);
        try {
          await store.dispatch.job.createOrUpdateJob(jobData);
          await store.dispatch.product.refresh();
          await store.dispatch.jobs.updateJob(this.job);

          if (isJobPendingReview) {
            router.push({
              name: 'purchase-order-products',
              params: { projectUid: this.job.project.uid },
            });
          }
        } catch (err: any) {
          this.errorMessage = err;
        } finally {
          this.saving = false;
        }
        this.toggleEdit();
      }
    },
    validateElement(id: string, message: string): boolean {
      const el: HTMLInputElement = document.getElementById(id) as HTMLInputElement;
      if (!el) {
        return false;
      }
      if (!el.checkValidity()) {
        this.errorMessage += message + '\n';
        return false;
      }
      return true;
    },
    validateDimensions(id: string, message: string): boolean {
      const el: HTMLInputElement = document.getElementById(id) as HTMLInputElement;
      if (!el) {
        return false;
      }
      if (!el.checkValidity()) {
        this.errorMessage += message + '\n';
        return false;
      }
      return true;
    },
    validateNumber(value: number, message: string): boolean {
      if (typeof value === 'number') {
        return true;
      }
      this.errorMessage += message + '\n';
      return false;
    },
    validateForm(): boolean {
      this.clearMessages();
      let valid = true;
      valid = this.validateNumber(this.input.brandId, 'Brand is required') && valid;
      valid = this.validateNumber(this.input.classId, 'Class is required') && valid;
      valid = this.validateElement('name', 'Name is required') && valid;
      valid = this.validateElement('height', 'Height must be a number over 0.01') && valid;
      valid = this.validateElement('width', 'Width must be a number over 0.01') && valid;
      valid = this.validateElement('depth', 'Depth must be a number over 0.01') && valid;
      valid = this.validateNumber(this.input.dimensions.unitTypeId, 'Units are required') && valid;
      return valid;
    },
    getJobFromLocalState(): JobUpdateInterface {
      return {
        additionalDimensions: this.input.dimensions.additional,
        asin: this.input.asin,
        brandId: this.input.brandId,
        classId: this.input.classId,
        depth: this.input.dimensions.depth,
        dateDue: this.input.dateDue,
        height: this.input.dimensions.height,
        materialInformation: this.input.materialInformation,
        modelingInstructions: this.input.modelingInstructions,
        name: this.input.name,
        notes: this.input.notes,
        partNumber: this.input.partNumber,
        priorityId: this.input.priority,
        price: this.input.price,
        projectUid: this.input.projectUid,
        jobUid: this.job.uid,
        url: this.input.url,
        unitTypeId: this.input.dimensions.unitTypeId,
        qualityId: this.input.quality,
        studioId: this.input.studioId,
        width: this.input.dimensions.width,
      };
    },
  },
  props: {
    loading: Boolean,
    editEnabled: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped>
.align-vertical {
  display: flex;
  align-items: center;
}
</style>
