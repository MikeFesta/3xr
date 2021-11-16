<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/artist/ArtistAccount.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import backend from '@/services/3xrCom';
import SpinnerButton from '@/components/buttons/SpinnerButton.vue';
import { mapState } from 'vuex';
import store from '@/store/index';

export default Vue.extend({
  name: 'artist-account',
  metaInfo: {
    title: 'My Artist Account | 3XR',
  },
  components: {
    'spinner-button': SpinnerButton,
  },
  computed: {
    isQa: () => store.getters.user.isQa,
    ...mapState({
      user: (state: any) => state.user.user,
    }),
    emailNotifications: {
      get() {
        return store.state.user.user.emailNotifications;
      },
      set(newVal: boolean) {
        this.currentEmailNotifications = newVal;
      },
    },
  },
  created() {
    if (!this.user.apiToken) {
      backend
        .get('user/api_token')
        .then((token) => {
          store.commit.user.SET_API_TOKEN(token.data);
        })
        .catch((err) => {});
    }
  },
  data: function () {
    return {
      errorMessage: '',
      successMessage: '',
      saving: false,
      e1: 0,
      apiToken: '',
      generating: false,
      dialog1: false,
      currentEmailNotifications: store.state.user.user.emailNotifications,
    };
  },
  methods: {
    clearMessages() {
      this.errorMessage = '';
      this.successMessage = '';
    },
    generateApiToken() {
      this.generating = true;
      backend
        .get('user/generate_api_token')
        .then((token) => {
          store.commit.user.SET_API_TOKEN(token.data);
          this.generating = false;
        })
        .catch((err) => {
          this.errorMessage = 'Problem generating API Token - Contact support@3xr.com';
          this.generating = false;
        });
    },
    validateForm() {
      let email: HTMLInputElement = document.getElementById('email') as HTMLInputElement;
      if (!email.checkValidity()) {
        this.errorMessage = 'Invalid Email';
        return false;
      }
      return true;
    },
    saveChanges() {
      // TODO: Save to a local object instead of working from $store
      this.clearMessages();
      if (this.validateForm()) {
        this.saving = true;
        backend
          .post('user/update', {
            id: store.state.user.user.id,
            firstName: store.state.user.user.firstName,
            lastName: store.state.user.user.lastName,
            email: store.state.user.user.email,
            emailNotifications: this.currentEmailNotifications,
          })
          .then((result) => {
            if (result.data === 'success') {
              this.successMessage = 'Changes Saved';
            } else {
              this.errorMessage = 'Unable to Save Changes';
            }
            this.saving = false;
          })
          .catch((err) => {
            this.errorMessage = 'Update Failed';
            this.saving = false;
          });
      }
    },
  },
});
</script>

<style lang="scss">
.theme--light.v-application {
  background-image: none;
}
.theme--dark.v-application {
  background-image: none;
}
</style>
