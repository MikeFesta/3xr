<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/forms/XrInlineTextareafield.pug">
</template>
                                                 
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'xr-inline-textareafield',
  inheritAttrs: false,
  props: {
    value: String,
    isEditEnabled: Boolean,
  },
});
</script> 