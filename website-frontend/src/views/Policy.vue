<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/Policy.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import store from '@/store/index';

export default Vue.extend({
  name: 'policy',
  metaInfo: {
    title: 'Privacy Policy | 3XR',
  },
  created() {
    this.fetchPrivacyPolicy();
  },
  computed: {
    contractContent: () => store.state.usersAgreement.userAgreement?.content,
  },
  methods: {
    async fetchPrivacyPolicy() {
      try {
        await store.dispatch.usersAgreement.setAgreeementAsPrivacyPolicy();
      } catch (err) {}
    },
  },
});
</script>
