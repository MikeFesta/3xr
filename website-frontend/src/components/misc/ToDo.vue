<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/misc/ToDo.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { vuetifyComponents } from '@/plugins/vuetify';
import { mapState } from 'vuex';

export default Vue.extend({
  name: 'todo',
  components: {
    ...vuetifyComponents,
  },
  computed: {
    ...mapState({
      user: (state: any) => state.user.user,
    }),
  },
  props: {
    due: String,
    note: String,
    label: String,
  },
});
</script>

<style lang="scss" scoped>
.todo {
  border: solid 1px #333;
  display: inline-block;
  background-color: #ffa;
  padding: 2px;
}
.label {
  background-color: #ff0;
  font-size: 10pt;
  font-weight: bold;
  display: inline;
  padding: 2px;
}
.note {
  display: inline;
  font-size: 10pt;
  padding: 5px;
}
</style>
