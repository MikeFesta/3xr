<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/Terms.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import store from '@/store/index';

export default Vue.extend({
  name: 'terms-of-use',
  metaInfo: {
    title: 'Terms of Use | 3XR',
  },
  created() {
    this.fetchTermsOfService();
  },
  computed: {
    contractContent: () => store.state.usersAgreement.userAgreement?.content,
  },
  methods: {
    async fetchTermsOfService() {
      try {
        await store.dispatch.usersAgreement.setAgreeementAsTermsOfService();
      } catch (err) {}
    },
  },
});
</script>
