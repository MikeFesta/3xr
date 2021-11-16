<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/privacy-dialog/PrivacyDialog.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapState } from 'vuex';
import store from '@/store';

export default Vue.extend({
  name: 'privacy-dialog',
  data: () => ({
    dialog: false,
    dialogPromptShowing: false,
  }),
  computed: {
    ...mapGetters('usersAgreement', ['isPrivacyAgreementType']),
    ...mapState({
      user: (state: any) => state.user.user,
      userId: (state: any) => state.user.user.id,
    }),
    contractContent: () => {
      const userAgreements = store.state.usersAgreements.userAgreements;
      if (userAgreements) {
        return userAgreements.map((userAgreement) => userAgreement.content).join('<br>');
      }
      return null;
    },
  },
  async created() {
    await this.checkIUserAgreements();
  },
  watch: {
    userId: function (userId) {
      if (userId > 0) {
        this.checkIUserAgreements();
      }
    },
  },
  methods: {
    async checkIUserAgreements(): Promise<void> {
      await store.dispatch.usersAgreements.fetchAll();
      const isUserEligableToEnterSite = store.getters.usersAgreements.isUserEligableToEnterSite;
      if (!isUserEligableToEnterSite) {
        this.showDialog();
      }
    },
    async respondToUserAgreement(response: boolean): Promise<void> {
      const userAgreements = store.getters.usersAgreements.userAgreementsToEnterSite;
      if (userAgreements) {
        const submitResponseCommands = userAgreements.map((userAgreement) => {
          return {
            userAgreementId: userAgreement.id,
            response,
          };
        });
        await store.dispatch.usersAgreementResponses.submitResponses(submitResponseCommands);
        this.closeDialog();
        if (!response) {
          store.dispatch.user.logout(this.$router.currentRoute);
        }
      }
    },
    showDialog(): void {
      this.dialog = true;
      this.dialogPromptShowing = true;
    },
    closeDialog(): void {
      this.dialog = false;
      this.dialogPromptShowing = false;
    },
  },
});
</script>
