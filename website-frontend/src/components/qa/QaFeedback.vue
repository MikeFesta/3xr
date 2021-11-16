<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/qa/QaFeedback.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { vuetifyComponents } from '@/plugins/vuetify';
import { mapState } from 'vuex';
import AssetSubmissionIssue from '@/store/interfaces/AssetSubmissionIssue';
import backend from '@/services/3xrCom';
import SpinnerButton from '@/components/buttons/SpinnerButton.vue';
import store from '@/store/index';
import QaSubmissionIssue from '@/components/qa/QaSubmissionIssue.vue';
import { USER_ROLE_TYPE } from '@/store/interfaces/types/UserRoleType';

export default Vue.extend({
  name: 'asset-submission-review',
  components: {
    ...vuetifyComponents,
    QaSubmissionIssue,
    SpinnerButton,
  },
  computed: {
    isClient: () => store.getters.user.isClient,
    noIssues(): boolean {
      return this.assetSubmission.openIssues.length == 0;
    },
    resolved3xrIssues(): Array<AssetSubmissionIssue> {
      return this.assetSubmission.resolvedIssues.filter((issue: AssetSubmissionIssue) => {
        return issue.authorRoleId == USER_ROLE_TYPE.QA;
      });
    },
    resolvedClientIssues(): Array<AssetSubmissionIssue> {
      return this.assetSubmission.resolvedIssues.filter((issue: AssetSubmissionIssue) => {
        return issue.authorRoleId == USER_ROLE_TYPE.CLIENT;
      });
    },
    selectedOpenIssue: {
      get: function (): number | null {
        for (let i = 0; i < this.assetSubmission.openIssues.length; i++) {
          if (this.assetSubmission.openIssues[i].id == this.assetSubmissionIssueHotspots.assetSubmissionIssueId) {
            return i;
          }
        }
        return null;
      },
      set: function (newIndex: number | null): void {
        // Bug: https://github.com/vuetifyjs/vuetify/issues/11225
        // When adding a new issue, the index is incorrect, and the wrong hotspot will be selected
        if (newIndex != null) {
          const newValue = this.assetSubmission.openIssues[newIndex].id;
          store.dispatch.assetSubmissionIssueHotspots.selectIssue(newValue);
        } else {
          store.dispatch.assetSubmissionIssueHotspots.selectIssue(0);
        }
      },
    },
    selectedResolvedIssue: {
      get: function (): number | null {
        for (let i = 0; i < this.assetSubmission.resolvedIssues.length; i++) {
          if (this.assetSubmission.resolvedIssues[i].id == this.assetSubmissionIssueHotspots.assetSubmissionIssueId) {
            return i;
          }
        }
        return null;
      },
      set: function (newIndex: number | null): void {
        if (newIndex != null) {
          const newValue = this.assetSubmission.resolvedIssues[newIndex].id;
          store.dispatch.assetSubmissionIssueHotspots.selectIssue(newValue);
        } else {
          store.dispatch.assetSubmissionIssueHotspots.selectIssue(0);
        }
      },
    },
    ...mapState({
      assetSubmission: (state: any) => state.assetSubmission.assetSubmission,
      assetSubmissionIssueHotspots: (state: any) => state.assetSubmissionIssueHotspots,
      user: (state: any) => state.user.user,
    }),
  },
  data: function () {
    return {
      errorMessage: '',
      submittingForQA: false,
    };
  },
  methods: {
    submitForQA() {
      this.errorMessage = '';
      this.submittingForQA = true;
      backend
        .post('submission/submit_for_qa', {
          id: this.assetSubmission.id,
        })
        .then((result) => {
          this.submittingForQA = false;
          store.dispatch.assetSubmission.refresh();
          store.dispatch.product.refresh();
        })
        .catch((err) => {
          this.errorMessage = 'Error Submitting for QA';
          this.submittingForQA = false;
        });
    },
  },
  props: {
    loading: Boolean,
  },
});
</script>

<style lang="scss" scoped>
.issue {
  max-width: 300px;
  max-height: 300px;
  object-fit: contain;
}
.reviewer-icon {
  color: #fff;
  padding-right: 10px;
}
.icon-bar {
  width: 100%;
  padding-left: 20px;
}
.v-expansion-panels > *:first-child {
  border-radius: 0px;
}
</style>
