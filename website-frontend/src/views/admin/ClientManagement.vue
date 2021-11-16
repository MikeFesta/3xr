<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/admin/ClientManagement.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { vuetifyComponents } from '@/plugins/vuetify';
import AdminTabs from '@/components/navigation/AdminTabs.vue';
import { mapState } from 'vuex';
import store from '@/store/index';

export default Vue.extend({
  name: 'admin-client-management',
  metaInfo: {
    title: 'Manage Clients | 3XR',
  },
  components: {
    AdminTabs,
    ...vuetifyComponents,
  },
  computed: {
    headers() {
      return [
        {
          text: 'Client',
          align: 'left',
          value: 'name',
        },
        {
          text: 'Created At',
          align: 'right',
          value: 'createdAt',
        },
      ];
    },
    ...mapState({
      pickList: (state: any) => state.pickList.pickList,
      clients: (state: any) => state.clients.clients,
    }),
  },
  created: function () {
    store.dispatch.clients.loadAllForAdmin().then((result) => {
      this.loading = false;
    });
  },
  data: () => ({
    changed: false,
    errorMessage: '',
    loading: true,
    resultsPerPage: 15,
    searchString: '',
    showPassword: false,
  }),
});
</script>
