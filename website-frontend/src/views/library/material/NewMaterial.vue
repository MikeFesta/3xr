<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/library/material/NewMaterial.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { vuetifyComponents } from '@/plugins/vuetify';
import backend from '@/services/3xrCom';
import LibraryTabs from '@/components/navigation/LibraryTabs.vue';
import { mapState } from 'vuex';
import router from '@/router/index';
import SpinnerButton from '@/components/buttons/SpinnerButton.vue';
import XrImg from '@/components/image/XrImg.vue';

export default Vue.extend({
  name: 'new-material',
  metaInfo: {
    title: 'New Material | 3XR',
  },
  components: {
    LibraryTabs,
    SpinnerButton,
    XrImg,
    ...vuetifyComponents,
  },
  computed: {
    blendName: function (): string {
      return JSON.stringify(this.name.replace(/\s+/g, '_').toLowerCase()).replace(/\W/g, '').substring(0, 40);
    },
    ...mapState({
      pickList: (state: any) => state.pickList.pickList,
      materials: (state: any) => state.materials.materials,
    }),
  },
  data: () => ({
    errorMessage: '',
    diffuseColorHex: '#ffffff',
    mappingScale: 1,
    metallic: false,
    name: '',
    normalStrength: 1,
    roughness: 1,
    saving: false,
    successMessage: '',
  }),
  methods: {
    clearMessages: function (): void {
      this.errorMessage = '';
      this.successMessage = '';
    },
    createMaterial: async function (): Promise<void> {
      try {
        this.clearMessages();
        if (this.validateForm()) {
          this.saving = true;
          const result = await backend.post('material/new', {
            diffuseColorHex: this.diffuseColorHex.substring(1, 7),
            mappingScale: this.mappingScale,
            metallic: this.metallic,
            name: this.name,
            normalStrength: this.normalStrength,
            roughness: this.roughness,
          });
          this.saving = false;
          if (result.data.success) {
            this.successMessage = this.name + ' Created Successfully with UID: ' + result.data.uid;
            this.name = '';
            router.push({ name: 'material-details', params: { uid: result.data.uid } });
          } else {
            this.errorMessage = result.data.errorMessage || 'Unknown Error';
          }
        }
      } catch (e) {
        this.saving = false;
        this.errorMessage = 'Unable to create material';
      }
    },
    validateForm: function (): boolean {
      if (this.name.length == 0) {
        this.errorMessage = 'Material Name is Missing';
        return false;
      }
      return true;
    },
  },
});
</script>
