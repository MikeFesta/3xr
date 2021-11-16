<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/buttons/SpinnerButton.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { vuetifyComponents } from '@/plugins/vuetify';
export default Vue.extend({
  components: {
    ...vuetifyComponents,
  },
  methods: {
    click() {
      if (this.confirmMessage) {
        if (confirm(this.confirmMessage)) {
          this.onClick();
        }
      } else {
        this.onClick();
      }
    },
  },
  props: {
    color: String,
    confirmMessage: String,
    disabled: Boolean,
    errorMessage: String,
    icon: String,
    label: String,
    loadingLabel: String,
    loading: Boolean,
    onClick: { type: Function, required: true },
  },
});
</script>

<style lang="sass" scoped>
.spinner-button
  margin: 12px 0px
  display: inline
</style>
