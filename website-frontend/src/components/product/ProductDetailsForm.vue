<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/product/ProductDetailsForm.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import backend from '@/services/3xrCom';
import { mapState } from 'vuex';
import SpinnerButton from '@/components/buttons/SpinnerButton.vue';
import XrImg from '@/components/image/XrImg.vue';
import store, { RootState } from '@/store/index';
import { JobUpdateInterface } from '@/store/interfaces/Job';
import x from '@/services/x';
import { JOB_QUALITY_TYPE } from '@/store/interfaces/types/JobQualityType';
import { JOB_PRIORITY_TYPE } from '@/store/interfaces/types/JobPriorityType';

interface InputDimensions {
  additional: string;
  depth?: number;
  height?: number;
  width?: number;
  units: number;
}

export default Vue.extend({
  components: {
    SpinnerButton,
    XrImg,
  },
  computed: {
    selectedArtistId: {
      get: function (): number {
        if (this.newArtistId > 0) {
          return this.newArtistId;
        } else if (this.job.product.artist.id > 0) {
          return this.job.product.artist.id;
        }
        return this.project.artist.id;
      },
      set: function (newValue: number) {
        this.newArtistId = newValue;
      },
    },
    isAdmin: () => store.getters.user.isAdmin,
    ...mapState({
      artists(state: RootState) {
        return state.artists.artists;
      },
      client: (state: RootState) => state.client.client,
      job: (state: RootState) => state.job.job,
      pickList: (state: RootState) => state.pickList.pickList,
      project: (state: RootState) => state.project.project,
      user: (state: RootState) => state.user.user,
    }),
  },
  async created() {
    this.loadDefaults();
    const jobUid = this.$route.params.jobUid;
    if (this.job.uid || jobUid) {
      // Job may not be assigned yet if this is a new product
      await store.dispatch.job.fetchByUid(this.job.uid || jobUid);
      this.loadValues();
    }
    if (this.artists.length == 0 && this.user.admin) {
      // TODO: store this list elsewhere, perhaps an adminPickList
      backend
        .get('user/artist_picklist')
        .then((result) => {
          store.commit.artists.SET(result.data);
        })
        .catch((err) => {});
    }
  },
  data() {
    return {
      errorMessage: '',
      dialog1: false,
      dialog2: false,
      dialog3: false,
      dialog4: false,
      dialog5: false,
      input: {
        asin: '',
        brand: 0,
        class: 0,
        dateDue: '',
        dimensions: {
          additional: '',
          depth: undefined,
          height: undefined,
          width: undefined,
          units: 0,
        } as InputDimensions,
        materialInformation: '',
        modelingInstructions: '',
        name: '',
        notes: '',
        partNumber: '',
        price: 0,
        priority: 0,
        quality: 0,
        studioId: 0,
        url: '',
      },
      newArtistId: 0,
      saving: false,
      step: 1,
      uploading: false,
      uploadProgress: 0,
    };
  },
  methods: {
    async assignArtist() {
      if (this.selectedArtistId !== this.job.product.artistUserId) {
        try {
          await store.dispatch.product.assignArtist({
            uids: [this.job.product.uid],
            artistId: this.selectedArtistId,
            projectUid: this.project.uid,
          });
          await store.dispatch.job.refresh();

          this.$router.push({
            name: 'purchase-order-products',
            params: { projectUid: this.project.uid },
          });
        } catch (err) {
          this.errorMessage = `Error Assigning Artist. ${err}`;
        }
      }
    },
    clearError() {
      this.errorMessage = '';
    },
    loadDefaults() {
      if (this.client.brands.length > 0) {
        if (!this.input.brand && this.project.brand.id) {
          this.input.brand = this.project.brand.id;
        }
      }
      if (this.client.classes.length > 0) {
        if (!this.input.class && this.project.class.id) {
          this.input.class = this.project.class.id;
        }
      }
      if (!this.input.dateDue && this.project.dateDue) {
        this.input.dateDue = this.project.dateDue;
      }
      if (!this.input.priority && this.project.priority.id) {
        this.input.priority = this.project.priority.id;
      }
      if (!this.input.quality && this.project.quality.id) {
        this.input.quality = this.project.quality.id;
      }
      if (!this.input.dimensions.units && this.project.units.id) {
        this.input.dimensions.units = this.project.units.id;
      }
    },
    loadFormData() {
      if (this.job.uid) {
        this.loadValues();
      } else {
        this.loadDefaults();
      }
    },
    loadValues() {
      if (this.job.uid) {
        if (this.job.brand && this.job.brand.id > 0) {
          this.input.brand = this.job.brand.id;
        }
        if (this.job.class && this.job.class.id > 0) {
          this.input.class = this.job.class.id;
        }
        this.input.name = this.job.product.name;
        this.input.partNumber = this.job.product.partNumber;
        this.input.asin = this.job.product.asin || '';
        this.input.url = this.job.product.url;
        this.input.quality = this.job.quality ? this.job.quality.id : JOB_QUALITY_TYPE.STANDARD;
        this.input.priority = this.job.prority ? this.job.prority.id : JOB_PRIORITY_TYPE.STANDARD;
        this.input.dateDue = this.job.dateDue;
        this.input.price = this.job.price;
        this.input.notes = this.job.notes;
        this.input.dimensions.units = this.job.product.units.id;
        this.input.dimensions.height = this.job.product.height;
        this.input.dimensions.width = this.job.product.width;
        this.input.dimensions.depth = this.job.product.depth;
        this.input.dimensions.additional = this.job.additionalDimensions;
        this.input.materialInformation = this.job.materialInformation;
        this.input.modelingInstructions = this.job.modelingInstructions;
        this.input.studioId = this.job.studio.id;
        // hack to give the data a chance to register in the form
        setTimeout(() => {
          this.validateForm();
        }, 100);
      }
    },
    async setPrimaryImage(imageId: number) {
      await store.dispatch.product.updatePrimaryReferenceImage({
        uid: this.job.product.uid,
        primaryImageId: imageId,
      });
      await store.dispatch.job.refresh();
    },
    async removeAdditionalFile(additionalFileId: number, filename: string) {
      if (confirm('Really Delete ' + filename + '?')) {
        await store.dispatch.product.deleteAdditionalFile({
          uid: this.job.product.uid,
          additionalFileId: additionalFileId,
        });
      }
    },
    async removeImage(imageId: number, filename: string) {
      if (confirm('Really Delete ' + filename + '?')) {
        await store.dispatch.product.deleteReferenceImage({
          uid: this.job.product.uid,
          imageId: imageId,
        });
        await store.dispatch.job.refresh();
      }
    },
    async persistFormState() {
      if (this.validateForm()) {
        this.saving = true;
        const data: JobUpdateInterface = {
          additionalDimensions: this.input.dimensions.additional,
          asin: this.input.asin,
          brandId: this.input.brand,
          classId: this.input.class,
          clientId: this.client.id,
          depth: this.input.dimensions.depth,
          dateDue: this.input.dateDue,
          height: this.input.dimensions.height,
          jobUid: this.job.uid,
          materialInformation: this.input.materialInformation,
          modelingInstructions: this.input.modelingInstructions,
          name: this.input.name,
          notes: this.input.notes,
          partNumber: this.input.partNumber,
          price: this.input.price,
          priorityId: this.input.priority,
          projectUid: this.project.uid,
          qualityId: this.input.quality,
          studioId: this.input.studioId,
          url: this.input.url,
          units: this.input.dimensions.units,
          unitTypeId: this.input.dimensions.units,
          width: this.input.dimensions.width,
        };
        try {
          const createdJob = await store.dispatch.job.createOrUpdateJob(data);

          // add created job uid to route params to be able to fetch job data on refresh
          if (!this.$route.params.jobUid) {
            this.$router.push({ path: createdJob.uid, append: true });
          }
          await store.dispatch.job.refresh();
          this.saving = false;
        } catch (e) {
          this.saving = false;
        }
      }
    },
    async submitDetails() {
      await this.persistFormState();
      if (this.step == 1) {
        this.step = 2;
      } else if (this.step == 3 && this.isAdmin) {
        this.step = 4;
      } else {
        this.$router.push({
          name: 'purchase-order-products',
          params: { projectUid: this.project.uid },
        });
      }
    },
    async uploadFiles(files: Array<any>) {
      this.uploading = true;
      let formData = new FormData();
      formData.append('uid', this.job.product.uid);
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      x.post('upload/product_additional_files', formData, {
        onUploadProgress: (progressEvent: ProgressEvent) => {
          this.uploadProgress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        },
      })
        .then(async (result) => {
          if (result.data == 'success') {
            // Update job to show the new files list
            await this.persistFormState();
            await store.dispatch.job.fetchByUid(this.job.uid);
            this.uploading = false;
          } else {
            this.uploading = false;
            this.errorMessage = 'Upload Failed';
          }
        })
        .catch((err) => {
          this.uploading = false;
          this.errorMessage = 'Upload Failed';
        });
    },
    uploadImages(files: Array<any>) {
      this.uploading = true;
      let formData = new FormData();
      formData.append('uid', this.job.product.uid);
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }
      x.post('upload/product_reference_images', formData, {
        onUploadProgress: (progressEvent: ProgressEvent) => {
          this.uploadProgress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        },
      })
        .then(async (result) => {
          if (result.data == 'success') {
            await this.persistFormState();
            await store.dispatch.job.fetchByUid(this.job.uid);
            this.uploading = false;
          } else {
            this.uploading = false;
            this.errorMessage = 'Upload Failed';
          }
        })
        .catch((err) => {
          this.uploading = false;
          this.errorMessage = 'Upload Failed';
        });
    },
    validateElement(id: string, message: string) {
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
    validateValue(value: number, message: string) {
      if (!value) {
        this.errorMessage += message + '\n';
        return false;
      }
      return true;
    },
    validateForm() {
      this.errorMessage = '';
      let valid = true;
      valid = this.validateValue(this.input.brand, 'Brand is required') && valid;
      valid = this.validateValue(this.input.class, 'Class is required') && valid;
      valid = this.validateValue(this.input.price, 'Price must be a number') && valid;
      valid = this.validateElement('name', 'Name is required') && valid;
      valid = this.validateElement('height', 'Height must be a number over 0.01') && valid;
      valid = this.validateElement('width', 'Width must be a number over 0.01') && valid;
      valid = this.validateElement('depth', 'Depth must be a number over 0.01') && valid;
      valid = this.validateValue(this.input.dimensions.units, 'Units are required') && valid;
      return valid;
    },
  },
  props: {
    loading: Boolean,
    productUid: String,
  },
  watch: {
    client: function () {
      this.loadFormData();
    },
    project: function () {
      this.loadFormData();
    },
  },
});
</script>

<style lang="scss" scoped>
.help-message {
  padding-top: 10px;
  font-style: italic;
}
.reference-image {
  display: inline-block;
  position: relative;
  .v-image {
    border: solid 1px #000;
  }
  .primary-img-flag {
    cursor: pointer;
    left: -8px;
    position: absolute;
    top: -8px;
    z-index: 4;
  }
  .mdi-close-circle {
    left: 0px;
    top: 10px;
  }
  .close {
    font-size: 18px !important;
    padding-top: 2px !important;
    margin-left: 116px;
    margin-top: -30px;
  }
  .primary-star {
    background-color: #fff;
    border-radius: 20px;
    position: absolute;
  }
}
</style>
