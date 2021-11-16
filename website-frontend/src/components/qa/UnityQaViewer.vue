<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/qa/UnityQaViewer.pug">
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  computed: {
    src: function (): string {
      return 'https://qa.3xr.com/' + this.asset.uid + '?s=' + this.assetSubmission.submissionNumber;
    },
  },
  props: {
    asset: Object,
    assetSubmission: Object,
    loading: Boolean,
  },
});
</script>
