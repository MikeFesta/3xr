<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/library/asset/AssetDashboard.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { vuetifyComponents } from '@/plugins/vuetify';
import LibraryTabs from '@/components/navigation/LibraryTabs.vue';
import { mapState } from 'vuex';
import router from '@/router/index';
import SpinnerButton from '@/components/buttons/SpinnerButton.vue';
import store from '@/store/index';
import XrImg from '@/components/image/XrImg.vue';
import AssetInterface from '@/store/interfaces/Asset';

export default Vue.extend({
  name: 'asset-dashboard',
  metaInfo: {
    title: 'Asset Library | 3XR',
  },
  components: {
    LibraryTabs,
    SpinnerButton,
    XrImg,
    ...vuetifyComponents,
  },
  computed: {
    headers() {
      return [
        { text: 'Thumbnail', align: 'left', sortable: false, value: 'thumbnail' },
        { text: 'Name', align: 'left', value: 'name' },
        { text: 'UID', align: 'left', value: 'uid' },
        { text: 'Published', align: 'left', value: 'published' },
        { text: 'Last Update', align: 'left', value: 'updatedAt' },
      ];
    },
    ...mapState({
      assets: (state: any) => state.assets.assets,
    }),
  },
  created: function () {
    store.dispatch.assets.loadAllForAdmin().then((result) => {
      this.loading = false;
    });
  },
  data: () => ({
    errorMessage: '',
    loading: true,
    resultsPerPage: 15,
    searchString: '',
  }),
  methods: {
    viewDetails: function (item: AssetInterface) {
      if (item.published) {
        router.push({ name: 'asset-details', params: { uid: item.uid } });
      }
    },
  },
});
</script>
