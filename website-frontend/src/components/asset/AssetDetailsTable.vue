<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="./AssetDetailsTable.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import store from '@/store/index';
import { mapState } from 'vuex';
import { vuetifyComponents } from '@/plugins/vuetify';

export default Vue.extend({
  name: 'asset-details-table',
  components: {
    ...vuetifyComponents,
  },

  computed: {
    isAdmin: () => store.getters.user.isAdmin,
    downloadRootUrl(): string {
      return 'https://cdn.3xr.com/models/' + this.asset.uid + '/' + this.asset.name;
    },
    publishAssetData: function () {
      return {
        assetUid: this.asset.uid,
      };
    },
    ...mapState({
      asset: (state: any) => state.asset.asset,
      user: (state: any) => state.user.user,
    }),
  },
  props: {
    loading: Boolean,
  },
});
</script>
