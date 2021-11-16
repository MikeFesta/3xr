<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/user/UserCard.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { vuetifyComponents } from '@/plugins/vuetify';

export default Vue.extend({
  name: 'user-card',
  components: {
    ...vuetifyComponents,
  },
  props: {
    user: Object,
  },
});
</script>

<style lang="scss" scoped>
.user-card {
  display: inline-block;
  margin: 10px;
  max-width: 512px;
  min-width: 256px;
}
</style>
