<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/library/part/PartDashboard.pug">
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
import MaterialInterface from '@/store/interfaces/Material';

export default Vue.extend({
  name: 'part-library-dashboard',
  metaInfo: {
    title: 'Part Library | 3XR',
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
        //{ text: 'Thumbnail', align: 'left', sortable: false, value: 'thumbnail' },
        { text: 'Name', align: 'left', value: 'name' },
        { text: 'UID', align: 'left', value: 'uid' },
        { text: 'Blend Name', align: 'left', value: 'blendName' },
        { text: 'Last Updated', align: 'left', value: 'updatedAt' },
      ];
    },
    ...mapState({
      //pickList: (state: any) => state.pickList.pickList,
      parts: (state: any) => state.parts.parts,
    }),
  },
  created: function () {
    store.dispatch.parts.loadAllForAdmin().then((result) => {
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
    viewDetails: function (item: MaterialInterface) {
      router.push({ name: 'part-details', params: { uid: item.uid } });
    },
  },
});
</script>
