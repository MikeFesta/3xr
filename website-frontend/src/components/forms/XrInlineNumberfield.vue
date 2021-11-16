<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/forms/XrInlineNumberfield.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { vuetifyComponents } from '@/plugins/vuetify';

export default Vue.extend({
  name: 'xr-inline-numberfield',
  components: {
    ...vuetifyComponents,
  },
  inheritAttrs: false,
  methods: {
    handleInput(value: string): void {
      const parsedValue: number = Number(value);
      if (!Number.isNaN(parsedValue)) {
        this.$emit('input', parsedValue);
      } else {
        this.$emit('input', null);
      }
    },
  },
  props: {
    value: Number,
    isEditEnabled: Boolean,
  },
});
</script>
