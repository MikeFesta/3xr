<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/user/Signup.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import backend from '@/services/3xrCom';
import SpinnerButton from '@/components/buttons/SpinnerButton.vue';
import VueRecaptcha from 'vue-recaptcha';
declare var grecaptcha: any;

export default Vue.extend({
  name: 'signup',
  metaInfo: {
    title: 'New Account | 3XR',
  },
  components: {
    SpinnerButton,
    VueRecaptcha,
  },

  computed: {
    recaptchaTheme: function () {
      if (this.$vuetify.theme.dark) {
        return 'dark';
      } else {
        return 'light';
      }
    },
  },

  data: () => ({
    errorMessage: '',
    input: {
      email: '',
      username: '',
    },
    loading: false,
    recaptchaToken: '',
    showPassword: false,
    successMessage: '',
  }),

  methods: {
    clearError() {
      this.errorMessage = '';
    },
    clearMessages() {
      this.errorMessage = '';
      this.successMessage = '';
    },
    onExpired() {
      this.recaptchaToken = '';
    },
    onVerify(response: any) {
      this.recaptchaToken = response;
    },
    submit() {
      this.clearMessages();
      if (this.validateForm()) {
        this.loading = true;
        backend
          .post('user/signup', {
            username: this.input.username,
            email: this.input.email,
            recaptchaToken: this.recaptchaToken,
          })
          .then((result) => {
            this.loading = false;
            if (result.data === 'success') {
              this.successMessage = 'Success - Check your email to complete registration';
              // TODO: Redirect to a check your email page (?)
            } else {
              this.errorMessage = result.data;
              grecaptcha.reset();
            }
          })
          .catch((err) => {
            this.loading = false;
            this.errorMessage = 'Unknown Error';
          });
      }
    },
    validateElement(id: string, message: string) {
      const el: HTMLInputElement = document.getElementById(id) as HTMLInputElement;
      if (!el.checkValidity()) {
        this.errorMessage = message;
        return false;
      }
      return true;
    },
    validateForm() {
      let valid =
        this.validateElement('username', 'Username is required') && this.validateElement('email', 'Invalid Email');
      if (!this.recaptchaToken) {
        this.errorMessage = 'Verify that you are human';
        valid = false;
      }
      return valid;
    },
  },
});
</script>

<style lang="scss" scoped>
.recaptcha {
  margin: auto;
  width: 304px;
}
.background {
  background-image: url('https://cdn.3xr.com/images/background-glowing-vertices.jpg');
  background-size: cover;
  height: 100%;
  margin-top: 0px;
  padding-top: 60px;
}
</style>
