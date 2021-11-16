<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/admin/UserManagement.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { vuetifyComponents } from '@/plugins/vuetify';
import AdminTabs from '@/components/navigation/AdminTabs.vue';
import { mapState } from 'vuex';
import router from '@/router/index';
import SpinnerButton from '@/components/buttons/SpinnerButton.vue';
import store from '@/store/index';
import User from '@/store/interfaces/User';

export default Vue.extend({
  name: 'admin-user-management',
  metaInfo: {
    title: 'Manage Users | 3XR',
  },
  components: {
    AdminTabs,
    SpinnerButton,
    ...vuetifyComponents,
  },
  computed: {
    headers() {
      return [
        { text: 'Username', align: 'left', value: 'username' },
        { text: 'Email', align: 'left', value: 'email' },
        { text: 'First Name', align: 'left', value: 'firstName' },
        { text: 'Last Name', align: 'left', value: 'lastName' },
        {
          text: 'Primary Role',
          align: 'left',
          value: 'primaryRole.name',
        },
        { text: 'Clients', align: 'left', value: 'clients' },
        { text: 'Created At', align: 'left', value: 'createdAt' },
      ];
    },
    ...mapState({
      pickList: (state: any) => state.pickList.pickList,
      users: (state: any) => state.users.users,
    }),
  },
  created: function () {
    store.dispatch.users.loadAllForAdmin().then((result) => {
      this.loading = false;
    });
  },
  data: () => ({
    loading: true,
    resultsPerPage: 15,
    saving: false,
    searchString: '',
    selectedUsers: [] as User[],
    showPassword: false,
  }),
  methods: {
    viewUser: function (item: any) {
      router.push({ name: 'admin-user-management-view-user', params: { username: item.username } });
    },
  },
});
</script>

<style lang="scss" scoped>
.admin {
  color: #d82849;
  font-weight: bold;
}
.edit-btn {
  width: 40px;
}
</style>
