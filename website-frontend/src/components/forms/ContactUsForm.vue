<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/forms/ContactUsForm.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import Backend from '@/services/3xrCom';
import SpinnerButton from '@/components/buttons/SpinnerButton.vue';

export default Vue.extend({
  name: 'contact-us-form',
  components: {
    SpinnerButton,
  },
  data() {
    return {
      dialog: false,
      errorMessage: '',
      input: {
        firstName: '',
        lastName: '',
        interest: 0,
        email: '',
        company: '',
        phone: '',
        message: '',
      },
      interests: [
        'AR 3D models',
        '360 degree web viewer',
        'Photorealistic renderings',
        'Multi-platform compatibility ',
        'Asset analytics ',
      ],
      submitting: false,
      submitSuccess: false,
    };
  },
  methods: {
    submitInquireForm: function () {
      if (this.validateForm()) {
        this.submitting = true;
        Backend.post('/contact_us', {
          firstName: this.input.firstName,
          lastName: this.input.lastName,
          interest: this.input.interest,
          email: this.input.email,
          phone: this.input.phone,
          company: this.input.company,
          message: this.input.message,
        })
          .then((result) => {
            this.submitting = false;
            if (result.data == 'success') {
              this.submitSuccess = true;
            } else {
              this.errorMessage = 'Sorry, there was an error. Please try again later.';
            }
          })
          .catch((err) => {
            this.errorMessage = err;
            this.submitting = false;
          });
      }
    },
    validateForm: function () {
      let firstName: HTMLInputElement = document.getElementById('firstName') as HTMLInputElement;
      if (!firstName.checkValidity()) {
        this.errorMessage = 'First Name is required';
        return false;
      }
      let lastName: HTMLInputElement = document.getElementById('lastName') as HTMLInputElement;
      if (!lastName.checkValidity()) {
        this.errorMessage = 'Last Name is required';
        return false;
      }
      let email: HTMLInputElement = document.getElementById('email') as HTMLInputElement;
      if (!email.checkValidity()) {
        this.errorMessage = 'Invalid Email';
        return false;
      }
      return true;
    },
  },
});
</script>
