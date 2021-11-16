<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/job/JobPreview.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import AssetDetailsTable from '@/components/asset/AssetDetailsTable.vue';
import JobDetailsTable from '@/components/job/JobDetailsTable.vue';
import ProductDetailsTable from '@/components/product/ProductDetailsTable.vue';
import { mapState } from 'vuex';

export default Vue.extend({
  name: 'job-preview',
  components: {
    AssetDetailsTable,
    JobDetailsTable,
    ProductDetailsTable,
  },
  computed: {
    ...mapState({
      job: (state: any) => state.job.job,
    }),
  },
  props: {
    admin: Boolean,
    close: Function,
    errorMessage: String,
    loading: Boolean,
  },
});
</script>

<style lang="scss" scoped>
.job-thumbnail {
  height: 80px;
}
.scrolling {
  height: auto;
  overflow: scroll;
}
@media (min-width: 900px) {
  .scrolling {
    height: 700px;
    overflow: scroll;
  }
}
@media (min-width: 1500px) {
  .scrolling {
    height: 1150px;
    overflow: scroll;
  }
}
</style>
