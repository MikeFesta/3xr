<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/user/ForgotPassword.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import backend from '@/services/3xrCom';
import SpinnerButton from '@/components/buttons/SpinnerButton.vue';

export default Vue.extend({
  name: 'forgot-password',
  metaInfo: {
    title: 'Forgot Password | 3XR',
  },
  components: {
    'spinner-button': SpinnerButton,
  },
  computed: {
    buttonDisabled(): boolean {
      return this.errorMessage != '' || this.successMessage != '';
    },
  },
  data: function () {
    return {
      errorMessage: '',
      input: {
        email: '',
      },
      loading: false,
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
      let email: HTMLInputElement = document.getElementById('email') as HTMLInputElement;
      if (!email.checkValidity()) {
        this.errorMessage = 'Invalid Email';
      } else {
        this.loading = true;
        backend
          .post('/user/forgot_password', {
            email: this.input.email,
          })
          .then((result) => {
            this.loading = false;
            if (result.data === 'success') {
              this.successMessage = 'Password Reset Email Sent';
            } else {
              this.errorMessage = result.data;
            }
          })
          .catch((err) => {
            this.errorMessage = err;
            this.loading = false;
          });
      }
    },
  },
});
</script>
