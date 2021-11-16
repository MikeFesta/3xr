<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/common/HelpAndFaq.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { Tab } from '@/store/interfaces/Dashboard';

export default Vue.extend({
  name: 'help-and-faq',
  data: function () {
    return {
      tabs: [
        {
          title: 'Help',
          icon: 'mdi-help-box',
          link: '/artist/resources/help',
        },
        {
          title: 'FAQ',
          icon: 'mdi-frequently-asked-questions',
          link: '/artist/resources/faq',
        },
        {
          title: 'Contact us',
          icon: 'mdi-card-account-mail',
          link: '/artist/resources/contact',
        },
      ] as Tab[],
      activeTab: '/artist/resources/help',
      input: {
        title: '',
        question: '',
      },
    };
  },
});
</script>

<style lang="scss">
.wrapper {
  margin: auto 4rem;
}
.title-right {
  float: right;
}
</style>
