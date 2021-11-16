<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/user/SetPassword.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import backend from '@/services/3xrCom';
import SpinnerButton from '@/components/buttons/SpinnerButton.vue';

export default Vue.extend({
  name: 'set-password',
  metaInfo: {
    title: 'Set Password | 3XR',
  },
  components: {
    'spinner-button': SpinnerButton,
  },
  created() {
    backend
      .post('/user/username_for_reset_token', { token: this.token })
      .then((result) => {
        this.input.username = result.data;
        if (result.data === 'INVALID LINK') {
          this.errorMessage = 'Your link is invalid or expired.';
        }
      })
      .catch((err) => {
        this.errorMessage = err;
      });
  },
  computed: {
    buttonEnabled(): boolean {
      return this.errorMessage != '';
    },
  },
  data: function () {
    return {
      errorMessage: '',
      input: {
        username: '',
        newPassword: '',
        confirmPassword: '',
      },
      loading: false,
      showPassword: false,
      successMessage: '',
    };
  },
  methods: {
    clearMessages() {
      this.errorMessage = '';
      this.successMessage = '';
    },
    submit: function () {
      this.clearMessages();
      if (this.input.newPassword.length < 8) {
        this.errorMessage = 'Password must be at least 8 characters';
      } else if (this.input.newPassword != this.input.confirmPassword) {
        this.errorMessage = 'The Passwords do not match';
      } else {
        this.loading = true;
        backend
          .post('/user/set_password_from_reset', {
            token: this.token,
            password: this.input.newPassword,
          })
          .then((result) => {
            this.loading = false;
            if (result.data == 'Unable to set password') {
              this.errorMessage = 'There was an error setting your password. Please contact info@3xr.com';
            } else {
              // Password Set, Return to login screen
              this.$router.replace({ name: 'login' });
            }
          })
          .catch((err) => {
            this.errorMessage = err;
            this.loading = false;
          });
      }
    },
  },
  props: ['token'],
});
</script>

<style lang="scss" scoped>
.background {
  background-image: url('https://cdn.3xr.com/images/background-glowing-vertices.jpg');
  background-size: cover;
  height: 100%;
  margin-top: -15px;
}
</style>
