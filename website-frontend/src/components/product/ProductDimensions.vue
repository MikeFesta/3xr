<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/product/ProductDimensions.pug">
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'product-dimensions',
  props: {
    label: {
      type: String,
      required: true,
    },
    // Note: would be better to pass a Dimensions Object instead of a product
    // Submission is also being passed here, which works since it has dimensions like product
    product: {
      type: Object,
      required: true,
    },
  },
});
</script>
