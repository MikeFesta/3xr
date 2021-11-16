<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/App.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { vuetifyComponents } from '@/plugins/vuetify';
import VueMeta from 'vue-meta';
import { mapState } from 'vuex';
import NotificationCenter from '@/components/notifications/NotificationCenter.vue';
import backend from '@/services/3xrCom';
import sidebarLinks, { SideLink } from '@/components/navigation/sidebar';
import store from '@/store/index';
import PrivacyDialog from '@/components/privacy-dialog/PrivacyDialog.vue';

Vue.use(VueMeta);

export default Vue.extend({
  name: 'App',
  components: {
    ...vuetifyComponents,
    NotificationCenter,
    PrivacyDialog,
  },
  computed: {
    authenticated: () => store.getters.user.authenticated,
    isAdmin: () => store.getters.user.isAdmin,
    role: () => store.getters.user.role,
    currentSidebar(): SideLink[] {
      // filtered sidebar based on user role
      return sidebarLinks.filter((item) => item.roles.includes(this.role));
    },
    ...mapState({
      pickList: (state: any) => state.pickList.pickList,
      user: (state: any) => state.user.user,
    }),
  },
  async created() {
    // Note: first notifications fetch moved to UserState.ts
    // poll notifications every 5min. Remove once websockets are implemented (only if logged in)
    this.polling = window.setInterval(() => {
      if (this.isPageActive) {
        store.dispatch.notifications.fetchNotifications();
      }
    }, 300000);
  },
  mounted(): void {
    // Set the name of the hidden property and the change event for visibility
    if (typeof document.hidden !== 'undefined') {
      // Opera 12.10 and Firefox 18 and later support
      this.pageHidden = 'hidden';
      this.pageVisibility = 'visibilitychange';
    } else if (typeof (document as any).msHidden !== 'undefined') {
      this.pageHidden = 'msHidden';
      this.pageVisibility = 'msvisibilitychange';
    } else if (typeof (document as any).webkitHidden !== 'undefined') {
      this.pageHidden = 'webkitHidden';
      this.pageVisibility = 'webkitvisibilitychange';
    }

    // Handle page visibility change
    if (this.pageVisibility) {
      window.addEventListener(this.pageVisibility, this.handleVisibilityChange);
    }
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
  data: () => ({
    dropdown_notifications: ['QA review', 'New Model Assigned', 'Model Approved'],
    footerLinks: [
      { label: 'HOME', url: '/', public: true, visibleLoggedIn: true },
      { label: 'THE PLATFORM', url: '/platform', public: true, visibleLoggedIn: false },
      {
        label: 'HELP & FAQ',
        url: '/artist/resources/help',
        public: false,
        visibleLoggedIn: true,
      },
      { label: 'LOGIN', url: '/login', public: true, visibleLoggedIn: false },
    ],
    navLinks: [],
    searchString: '',
    showDrawer: true,
    polling: 0,
    pageVisibility: '',
    pageHidden: '',
    isPageActive: true,
  }),
  methods: {
    async changePrimaryRole(roleId: number): Promise<void> {
      try {
        const response = await backend.post('admin/account/set_primary_role', { primaryRoleId: roleId });
        if (response.data == 'success') {
          store.dispatch.user.setPrimaryRole(roleId);
        }
      } catch (error) {}
    },
    async logout(): Promise<void> {
      return store.dispatch.user.logout(this.$router.currentRoute);
    },
    search(): void {
      if (this.$router.currentRoute.fullPath != '/search?q=' + encodeURIComponent(this.searchString)) {
        this.$router.push('/search?q=' + encodeURIComponent(this.searchString));
        this.searchString = '';
      }
    },
    handleVisibilityChange(): void {
      if ((document as any)[this.pageHidden]) {
        // page is hidden (another browser tab is active)
        this.isPageActive = false;
      } else {
        this.isPageActive = true;
      }
    },
  },
});
</script>

<style lang="scss">
@import '@/styles/variables.scss';
.black-font {
  color: $color-black;
}
.blue-font {
  color: $color-blue;
}
.orange-font {
  color: $color-orange;
}
.red-font {
  color: $color-red !important;
}
.white-font {
  color: $color-white;
}
body {
  font-family: 'Poppins', sans-serif;
}
.v-application {
  font-family: 'Poppins', sans-serif !important;
}
.v-application a {
  text-decoration: none;
  border: none;
}
.v-application .display-1 {
  color: $color-blue;
}
.v-btn {
  color: $color-white;
  height: 30px !important;
  padding: 0 10px !important;
  box-shadow: none !important;
}
.v-btn.v-btn--contained.theme--light.v-size--default {
  color: $color-white;
}
.v-expansion-panels {
  border: 1px solid $color-light-blue;
}
.spacer {
  margin-top: 20px;
}
.v-card {
  padding: 10px;
}
.v-card__title {
  color: $color-light-blue;
}
.v-stepper {
  background: none;
}
.v-data-table.elevation-1.theme--dark {
  color: $color-white;
  border: $color-orange solid medium;
}
.v-file-input__text--placeholder {
  color: #999999 !important;
}
.elevation-0 {
  background: none;
}
.theme--light.v-application {
  background-color: $color-white !important;
}
.theme--dark.v-card {
  background-color: #303030 !important;
}
.theme--dark.v-data-table thead tr:last-child th {
  color: $color-white;
}
.theme--dark.v-data-table thead tr th {
  color: $color-white;
  border-bottom: $color-orange solid 2px;
  border-right: $color-orange solid 1px;
  font-size: 18px;
}
.v-data-table.elevation-1.theme--light {
  border: $color-blue solid medium;
}
.theme--light.v-data-table thead tr th {
  border-bottom: $color-blue solid 2px !important;
  border-right: $color-blue solid 1px;
  font-size: 18px;
  background-color: #f5f7fc;
}
.login-btn .v-btn:not(.v-btn--round).v-size--default {
  margin-right: 30px;
}
.admin-details-row {
  color: $color-dark-gray;
}
.assets-thumb {
  border-radius: 5px;
  margin-right: 20px;
  padding: 5px;
}
.banner-logo {
  background-image: url('https://cdn.3xr.com/images/3xr_white.svg');
  background-position: 0 10px;
  background-size: 50px;
  display: inline-block;
  height: 60px;
  width: 60px;
  margin-top: 5px;
  margin-bottom: 5px;
  margin-left: 15px;
}
.details-container {
  border-radius: 2px;
  border: $color-light-blue 3px solid;
  margin-bottom: 10px;
  padding-top: 0;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
  background-color: $color-light-blue;
  color: $color-dark-gray;
}
.details-header {
  color: $color-white;
  padding: 2px;
  margin-top: 4px;
  margin-bottom: 10px;
}
.details-row {
  background-color: $color-white;
  border: #cce5f4 1px solid;
  overflow: hidden;
  hyphens: auto;
}
.download-button {
  background-color: #dda349;
  border-radius: 5px;
  display: inline;
  padding: 5px 5px 5px 0px;
  font-weight: bold;
}
.error-message,
.success-message {
  font-weight: bold;
  padding-left: 10px;
  margin-bottom: 10px;
}
.error-message {
  background-color: #eff2f9;
  border-radius: 0px;
  padding: 8px;
  text-align: center;
  color: $color-red;
}
h1 {
  text-transform: uppercase;
}
h2 {
  color: $color-blue;
  font-weight: normal;
}
.img-max {
  height: 200px;
  max-width: 200px;
  object-fit: contain;
}
.initials {
  position: absolute;
  top: 8x;
  left: 1%;
  right: 1%;
  color: #fff;
}
.left-table {
  background-color: #f5f7fc;
  color: $color-dark-gray !important;
  font-weight: bold;
}
.light-blue-bkg {
  background-color: #eff2f9;
}
.margin-auto {
  margin: auto;
}
.ma-4-l-r {
  margin-left: 20px;
  margin-right: 20px;
}
.outline-btn {
  border: #fff solid 1px;
  border-radius: 15px;
  padding: 5px 20px 5px 20px;
  margin-left: -10px;
  margin-right: -10px;
}
.response {
  background-color: #cbe0ec;
  padding: 10px;
  border-radius: 5px;
}
.scroll-policy {
  height: 500px;
  overflow: scroll;
  padding: 20px;
  border: #cce5f4 solid 2px;
  border-radius: 5px;
  margin-bottom: 10px;
}
.scroll-policy h3 {
  padding-bottom: 10px;
}
.shift-r {
  margin-left: 0;
}
.site-search {
  background-color: $color-light-blue;
  border-radius: 8px;
  padding: 10px 15px 10px 15px;
  text-shadow: none;
}
.status-dropdown {
  height: 50px;
}
.success-message {
  background-color: #eff2f9;
  border-radius: 5px;
  padding: 8px;
  text-align: center;
  color: $color-blue;
}
.top-nav {
  font-size: 16px !important;
  margin-left: 20px;
  margin-right: 20px;
}
.upper {
  text-transform: uppercase;
}
.user-thumb {
  background-color: $color-white;
  padding: 5px;
  border: $color-blue solid 2px;
}
.video {
  height: 500px;
}
.video-home {
  height: 500px;
}
.viewer {
  width: 200px;
  height: 200px;
}
@media (min-width: 900px) {
  .img-max {
    height: 300px;
    max-width: 300px;
    object-fit: contain;
  }
  .img-max-details {
    height: 400px;
    max-width: 400px;
    object-fit: contain;
  }
  .shift-r {
    margin-left: -2%;
  }
  .video {
    height: 250px;
  }
  .viewer {
    width: 300px;
    height: 300px;
  }
}
@media (min-width: 1024px) {
  .img-max {
    height: 250px;
    max-width: 250px;
    object-fit: contain;
  }
  .img-max-details {
    height: 400px;
    max-width: 400px;
    object-fit: contain;
  }
  .video {
    height: 350px;
  }
  .viewer {
    width: 250px !important;
    height: 250px !important;
  }
}
@media (min-width: 1500px) {
  .img-max {
    height: 500px;
    max-width: 500px;
    object-fit: contain;
  }
  .img-max-details {
    height: 600px;
    max-width: 600px;
    object-fit: contain;
  }
  .video {
    height: 300px;
  }
  .viewer {
    width: 500px !important;
    height: 500px !important;
  }
}
@media (min-width: 1904px) {
  .banner-logo {
    background-image: url('https://cdn.3xr.com/images/3xr_white.svg');
    background-position: 0 10px;
    background-size: 60px;
    display: inline-block;
    height: 70px;
    width: 70px;
    margin-top: 15px;
    margin-bottom: 15px;
    margin-left: 45px;
  }
  h1 {
    font-size: 48px;
  }
  h2 {
    font-size: 36px;
  }
  h3 {
    font-size: 30px;
    color: $color-dark-gray;
  }
  h4 {
    font-size: 22px;
  }
  p {
    font-size: 18px;
  }
  .top-nav {
    margin-left: 20px;
    margin-right: 20px;
    font-size: 20px !important;
  }
  .video-home {
    height: 800px;
  }
}
</style>
