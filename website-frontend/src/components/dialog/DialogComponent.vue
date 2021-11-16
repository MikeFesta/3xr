<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/dialog/DialogComponent.pug">
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'dialog-component',
  data: () => ({
    open: true,
  }),
  watch: {
    open: function (newValue) {
      if (newValue === false) {
        this.closeModal();
      }
    },
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
  },
});
</script>
