<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/admin/NewStudio.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { vuetifyComponents } from '@/plugins/vuetify';
import backend from '@/services/3xrCom';
import Studio from '@/store/interfaces/Studio';
import AdminTabs from '@/components/navigation/AdminTabs.vue';
import SpinnerButton from '@/components/buttons/SpinnerButton.vue';

export default Vue.extend({
  name: 'admin-studio-management-new-studio',
  metaInfo: {
    title: 'New Studio | 3XR',
  },
  components: {
    AdminTabs,
    SpinnerButton,
    ...vuetifyComponents,
  },
  data: () => ({
    errorMessage: '',
    saving: false,
    studio: new Studio(null),
  }),
  methods: {
    clearError: function () {
      this.errorMessage = '';
    },
    createStudio: async function () {
      this.clearError();
      const studio = this.studio;
      this.saving = true;
      try {
        const result = await backend.post('admin/studio/new_studio', {
          name: studio.name,
        });
        if (result.data != 'success') {
          this.errorMessage = result.data;
        } else {
          this.$router.push({ name: 'admin-studio-management' });
        }
      } catch (err: any) {
        this.errorMessage = err;
      }
      this.saving = false;
    },
    setChanged: function () {
      this.clearError();
    },
  },
});
</script>
