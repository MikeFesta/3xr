<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/user/Login.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import SpinnerButton from '@/components/buttons/SpinnerButton.vue';
import { mapState } from 'vuex';
import store from '@/store/index';

export default Vue.extend({
  name: 'Login',
  metaInfo: {
    title: 'Login | 3XR',
    meta: [
      { name: 'description', content: 'Login into your 3XR platform account' },
      { name: 'keywords', content: 'login to 3XR, 3XR account login' },
    ],
  },
  components: {
    SpinnerButton,
  },
  async created() {
    if (this.message) {
      this.errorMessage = this.message;
    }
    const result = await store.dispatch.user.checkLoginWithToken();
    if (result) {
      this.input.rememberMe = true;

      if (!result.data.isValid) {
        this.errorMessage = 'Session Expired, Please Log In Again';
      } else {
        const user = result.data;
        if (user.id > 0) {
          // Valid User
          store.dispatch.user.setUser(user);
          // If redirected to the login page, go back one
          if (this.$router.currentRoute.name === 'login') {
            this.$router.back();
          } else {
            this.$router.replace({ name: 'dashboard' });
          }
        }
      }
    }
  },
  computed: {
    ...mapState({
      user: (state: any) => state.user.user,
    }),
  },
  data: () => ({
    errorMessage: '',
    input: {
      username: '',
      password: '',
      rememberMe: false,
    },
    loggingIn: false,
    showPassword: false,
  }),
  methods: {
    clearError() {
      this.errorMessage = '';
    },
    async login() {
      const {
        redirect_uri: redirectUri,
        response_type: responseType,
        client_id: clientId,
        store_hash: storeHash,
      } = this.$router.currentRoute.query;
      if (
        typeof redirectUri === 'string' &&
        redirectUri &&
        responseType === 'code' &&
        typeof clientId === 'string' &&
        storeHash &&
        typeof storeHash === 'string'
      ) {
        return this.loginOauth(redirectUri, clientId, storeHash);
      }
      this.loggingIn = true;
      try {
        await store.dispatch.user.loginUser({
          username: this.input.username,
          password: this.input.password,
          get_token: this.input.rememberMe,
        });
        this.$router.replace({
          name: 'dashboard',
        });
      } catch (err: any) {
        // Error message when auth fails
        // Error: Request failed with status code 403
        this.errorMessage = err
          ? err.message == 'Unauthorized'
            ? 'Invalid Username or Password'
            : `${err.message}`
          : 'Login Failed';
      }
      this.loggingIn = false;
    },
    async loginOauth(redirectUri: string, clientId: string, storeHash: string) {
      // redirects back to `redirectUri` with authorization code once user has logged in
      try {
        await store.dispatch.user.loginOauth({
          username: this.input.username,
          password: this.input.password,
          get_token: true,
          redirectUri,
          clientId,
          storeHash,
        });
      } catch (err: any) {
        this.errorMessage = err
          ? err.message == 'Unauthorized'
            ? 'Invalid Username or Password'
            : `${err.message}`
          : 'Login Failed';
      }
    },
  },
  props: ['message'],
});
</script>

<style lang="scss" scoped>
.background {
  background-image: url('https://cdn.3xr.com/images/background-glowing-vertices.jpg');
  background-size: cover;
  height: 100%;
  margin-top: 0px;
  padding-top: 60px;
}
.new-user {
  font-size: 16px;
  text-transform: none;
  letter-spacing: normal;
  float: right;
  width: 150px;
  padding-top: 18px;
}
</style>
