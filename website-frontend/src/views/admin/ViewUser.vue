<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/admin/ViewUser.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { vuetifyComponents } from '@/plugins/vuetify';
import backend from '@/services/3xrCom';
import AdminTabs from '@/components/navigation/AdminTabs.vue';
import ToDo from '@/components/misc/ToDo.vue';
import { mapState } from 'vuex';
import router from '@/router/index';
import SpinnerButton from '@/components/buttons/SpinnerButton.vue';
import store from '@/store/index';

export default Vue.extend({
  name: 'admin-user-management-view-user',
  metaInfo() {
    return {
      title: 'View User | ' + this.user.username + ' | 3XR',
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
      clients: (state: any) => state.clients.clients,
      pickList: (state: any) => state.pickList.pickList,
      studios: (state: any) => state.studios.studios,
      user: (state: any) => state.otherUser.user,
    }),
  },
  created: async function () {
    try {
      await store.dispatch.otherUser.fetchByUsername(this.username);
      this.loading = false;
      await store.dispatch.clients.loadForUser(this.user.id);
      this.loadingClients = false;
      await store.dispatch.studios.loadForUser(this.user.id);
      this.loadingStudios = false;
      const clientPicklistRequest = await backend.get('/admin/client/client_picklist');
      this.clientPicklist = clientPicklistRequest.data.filter((client: any) => {
        // Don't include already linked clients in the picklist
        const linkedClientIds = this.clients.map((item: any) => item.id);
        return !linkedClientIds.includes(client.id);
      });
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
    clientIdToLink: 0,
    clientPicklist: [],
    errorMessage: '',
    linkingClient: false,
    linkingStudio: false,
    loading: true,
    loadingClients: true,
    loadingStudios: true,
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
    linkClient: async function () {
      if (!this.clientIdToLink) {
        this.errorMessage = 'Please select a client';
      } else {
        try {
          const response = await backend.post('admin/user/link_client', {
            clientId: this.clientIdToLink,
            userId: this.user.id,
          });
          if (response.data == 'success') {
            this.linkingClient = false;
            this.successMessage = 'Client Linked';
            await store.dispatch.clients.loadForUser(this.user.id);
          }
        } catch (err: any) {
          this.errorMessage = 'Error Linking Client: ' + err.message;
        }
      }
    },
    linkStudio: async function () {
      if (!this.studioIdToLink) {
        this.errorMessage = 'Please select a studio';
      } else {
        try {
          const response = await backend.post('admin/user/link_studio', {
            studioId: this.studioIdToLink,
            userId: this.user.id,
          });
          if (response.data == 'success') {
            this.linkingStudio = false;
            this.successMessage = 'Studio Linked';
            await store.dispatch.studios.loadForUser(this.user.id);
          }
        } catch (err: any) {
          this.errorMessage = 'Error Linking Studio: ' + err.message;
        }
      }
    },
    saveUser: async function () {
      this.clearError();
      const user = this.user;
      this.saving = true;
      const result = await backend.post('admin/user/edit', {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        primaryRoleId: user.primaryRoleId,
        password: user.newPassword,
      });
      if (result.data != 'success') {
        this.errorMessage = result.data;
      } else {
        this.changed = false;
        // If the username changed, update the url
        if (user.username != this.username) {
          router.push({ name: 'admin-user-management-view-user', params: { username: user.username } });
        }
      }
      this.saving = false;
    },
    setChanged: function () {
      this.changed = true;
      this.clearError();
    },
    unlinkClient: async function (clientId: number) {
      if (confirm('Really unlink client?')) {
        try {
          const response = await backend.post('admin/user/unlink_client', {
            clientId,
            userId: this.user.id,
          });
          if (response.data == 'success') {
            this.successMessage = 'Client Unlinked';
            await store.dispatch.clients.loadForUser(this.user.id);
          }
        } catch (err: any) {
          this.errorMessage = 'Error Unlinking Client: ' + err.message;
        }
      }
    },
    unlinkStudio: async function (studioId: number) {
      if (confirm('Really unlink studio?')) {
        try {
          const response = await backend.post('admin/user/unlink_studio', {
            studioId,
            userId: this.user.id,
          });
          if (response.data == 'success') {
            this.successMessage = 'Studio Unlinked';
            await store.dispatch.studios.loadForUser(this.user.id);
            // Note: this studio is not in the picklist and won't be added until the page is refreshed / re-created
          }
        } catch (err: any) {
          this.errorMessage = 'Error Unlinking Studio: ' + err.message;
        }
      }
    },
  },
  props: {
    username: String,
  },
});
</script>
