<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/admin/ViewClient.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { vuetifyComponents } from '@/plugins/vuetify';
import backend from '@/services/3xrCom';
import AdminTabs from '@/components/navigation/AdminTabs.vue';
import ToDo from '@/components/misc/ToDo.vue';
import { mapState } from 'vuex';
import SpinnerButton from '@/components/buttons/SpinnerButton.vue';
import store from '@/store/index';

export default Vue.extend({
  name: 'admin-client-management-view-client',
  metaInfo() {
    return {
      title: 'View Client | ' + this.client.name + ' | 3XR',
    };
  },
  components: {
    AdminTabs,
    SpinnerButton,
    ToDo,
    ...vuetifyComponents,
  },
  computed: {
    ...mapState({
      client: (state: any) => state.client.client,
      studios: (state: any) => state.studios.studios,
      users: (state: any) => state.users.users,
    }),
  },
  created: async function () {
    try {
      await store.dispatch.client.getDetailsByUid(this.uid);
      this.loading = false;
      await store.dispatch.studios.loadForClient(this.client.id);
      this.loadingStudios = false;
      await store.dispatch.users.loadForClient(this.client.id);
      this.loadingUsers = false;
      const studioPicklistRequest = await backend.get('/admin/studio/studio_picklist');
      this.studioPicklist = studioPicklistRequest.data.filter((studio: any) => {
        // Don't include already linked studios in the picklist
        const linkedStudioIds = this.studios.map((item: any) => item.id);
        return !linkedStudioIds.includes(studio.id);
      });
    } catch (err: any) {
      this.errorMessage = err;
    }
  },
  data: () => ({
    changed: false,
    errorMessage: '',
    linkingStudio: false,
    loading: true,
    loadingStudios: true,
    loadingUsers: true,
    saving: false,
    showPassword: false,
    studioIdToLink: 0,
    studioPicklist: [],
    successMessage: '',
  }),
  methods: {
    clearError: function () {
      this.errorMessage = '';
    },
    clearMessages: function () {
      this.errorMessage = '';
      this.successMessage = '';
    },
    filterClientOrStudio: function (item: any, search: string, itemText: string): boolean {
      const n = item.name.toLowerCase();
      return n.indexOf(search.toLowerCase()) > -1;
    },
    linkStudio: async function () {
      if (!this.studioIdToLink) {
        this.errorMessage = 'Please select a studio';
      } else {
        try {
          const response = await backend.post('admin/client/link_studio', {
            clientId: this.client.id,
            studioId: this.studioIdToLink,
          });
          if (response.data == 'success') {
            this.linkingStudio = false;
            this.successMessage = 'Studio Linked';
            await store.dispatch.studios.loadForClient(this.client.id);
          }
        } catch (err: any) {
          this.errorMessage = 'Error Linking Studio: ' + err.message;
        }
      }
    },
    saveClient: async function () {
      this.clearError();
      const client = this.client;
      this.saving = true;
      const result = await backend.post('admin/client/edit_client', {
        id: client.id,
        name: client.name,
      });
      if (result.data != 'success') {
        this.errorMessage = result.data;
      } else {
        this.changed = false;
      }
      this.saving = false;
    },
    setChanged: function () {
      this.changed = true;
      this.clearError();
    },
    unlinkStudio: async function (studioId: number) {
      if (confirm('Really unlink studio?')) {
        try {
          const response = await backend.post('admin/client/unlink_studio', {
            clientId: this.client.id,
            studioId,
          });
          if (response.data == 'success') {
            this.successMessage = 'Studio Unlinked';
            await store.dispatch.studios.loadForUser(this.client.id);
          }
        } catch (err: any) {
          this.errorMessage = 'Error Unlinking Studio: ' + err.message;
        }
      }
    },
  },
  props: {
    uid: String,
  },
});
</script>
