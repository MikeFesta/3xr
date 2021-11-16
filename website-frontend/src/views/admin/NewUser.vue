<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/admin/NewUser.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { vuetifyComponents } from '@/plugins/vuetify';
import backend from '@/services/3xrCom';
import AdminTabs from '@/components/navigation/AdminTabs.vue';
import { mapState } from 'vuex';
import SpinnerButton from '@/components/buttons/SpinnerButton.vue';
import User from '@/store/interfaces/User';

export default Vue.extend({
  name: 'admin-user-management-new-user',
  metaInfo: {
    title: 'New User | 3XR',
  },
  components: {
    AdminTabs,
    SpinnerButton,
    ...vuetifyComponents,
  },
  computed: {
    ...mapState({
      pickList: (state: any) => state.pickList.pickList,
    }),
  },
  data: () => ({
    errorMessage: '',
    saving: false,
    showPassword: false,
    user: new User(null),
  }),
  methods: {
    clearError: function () {
      this.errorMessage = '';
    },
    createUser: async function () {
      this.clearError();
      const user = this.user;
      this.saving = true;
      const result = await backend.post('admin/user/new', {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        primaryRoleId: user.primaryRoleId,
        password: user.newPassword,
        username: user.username,
      });
      if (result.data != 'success') {
        this.errorMessage = result.data;
      } else {
        this.$router.push({ name: 'admin-user-management' });
      }
      this.saving = false;
    },
    setChanged: function () {
      this.clearError();
    },
  },
});
</script>
