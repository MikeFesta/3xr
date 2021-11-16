<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/admin/NewClient.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { vuetifyComponents } from '@/plugins/vuetify';
import backend from '@/services/3xrCom';
import Client from '@/store/interfaces/Client';
import AdminTabs from '@/components/navigation/AdminTabs.vue';
import SpinnerButton from '@/components/buttons/SpinnerButton.vue';

export default Vue.extend({
  name: 'admin-client-management-new-client',
  metaInfo: {
    title: 'New Client | 3XR',
  },
  components: {
    AdminTabs,
    SpinnerButton,
    ...vuetifyComponents,
  },
  data: () => ({
    errorMessage: '',
    saving: false,
    client: new Client(null),
  }),
  methods: {
    clearError: function () {
      this.errorMessage = '';
    },
    createClient: async function () {
      this.clearError();
      const client = this.client;
      this.saving = true;
      try {
        const result = await backend.post('admin/client/new', {
          name: client.name,
        });
        if (result.data != 'success') {
          this.errorMessage = result.data;
        } else {
          this.$router.push({ name: 'admin-client-management' });
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
