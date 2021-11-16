<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/navigation/Tabs.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import store from '@/store/index';
import { Tab } from '@/store/interfaces/Dashboard';
import libraryTabs from './libraryTabs';
import { USER_ROLE_NAME } from '@/store/interfaces/types/UserRoleType';

export default Vue.extend({
  name: 'library-tabs',
  computed: {
    role: (): USER_ROLE_NAME => store.getters.user.role,
    tabs: function(): Tab[] {
      // return enabled tabs for each supported role.
      return [...libraryTabs[this.role]];
    },
  },
  data: () => {
    return {
      section: '',
    };
  },
});
</script>
