<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/UserGuideBC.pug">
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'big-commerce-user-guide',
  metaInfo: {
    title: 'Big Commerce User Guide | 3XR',
    meta: [
      {
        name: 'description',
        content:
          '3XR’s BigCommerce integration is a turnkey AR Solution that allows users to create & host product specific AR experiences on their storefronts using pre-existing product data.',
      },
      {
        name: 'keywords',
        content:
          'big commerce ar, big commerce 3d, augmented reality big commerce, ar app for big commerce, big commerce ar app, view in room big commerce, bigcommerce ar, bigcommerce app, 3d bigcommerce, how to view in room bigcommerce, bigcommerce view in space, bigcommerce 3xr, 3xr big commerce, 3d model bigcommerce, big commerce integrations, 3d app for big commerce, bigcommerce augmented reality, threekit bigcommerce, 360 spin bigcommerce',
      },
      { property: 'og:image', content: 'https://cdn.3xr.com/images/big-commerce/fan-storefront.jpg' },
    ],
  },
});
</script>

<style lang="scss" scoped>
.screenshots {
  max-width: 800px;
}
</style>
