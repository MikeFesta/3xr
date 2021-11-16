<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/qa/QaSubmissionIssue.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { vuetifyComponents } from '@/plugins/vuetify';
import backend from '@/services/3xrCom';
import { mapState } from 'vuex';
import SpinnerButton from '@/components/buttons/SpinnerButton.vue';
import store from '@/store/index';

export default Vue.extend({
  components: {
    ...vuetifyComponents,
    SpinnerButton,
  },
  computed: {
    imageBaseUrl() {
      return (
        'https://x.3xr.com/x/assets/' +
        this.assetSubmission.asset.uid +
        '/submissions/' +
        this.assetSubmission.submissionNumber +
        '/qa/'
      );
    },
    isAdmin: () => store.getters.user.isAdmin,
    ...mapState({
      assetSubmission: (state: any) => state.assetSubmission.assetSubmission,
      user: (state: any) => state.user.user,
    }),
  },
  created() {},
  data: () => ({
    deleting: false,
    errorMessage: '',
    input: {
      resolved: false,
      response: '',
    },
  }),
  methods: {
    deleteIssue() {
      this.deleting = true;
      backend
        .post('submission/issue/delete', {
          id: this.issue.id,
        })
        .then((result) => {
          this.deleting = false;
          store.commit.assetSubmission.SET(result.data);
        })
        .catch((err) => {
          this.deleting = false;
          this.errorMessage = err;
        });
    },
    markResolved() {
      backend
        .post('submission/issue/resolve', {
          id: this.issue.id,
          response: this.input.response,
        })
        .then((result) => {
          store.commit.assetSubmission.SET(result.data);
        })
        .catch((err) => {
          this.errorMessage = err;
        });
    },
  },
  props: {
    issue: Object,
  },
});
</script>

<style lang="scss" scoped>
.date {
  font-size: 80%;
}
.reply {
  background-color: #cbe0ec;
  padding: 2px 4px;
}
.qa-image {
  max-width: 100%;
}
</style>
