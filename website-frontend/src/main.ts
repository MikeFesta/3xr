// SPDX-License-Identifier: Apache-2.0
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import store from '@/store/index';
import { Route } from 'vue-router';

interface NextFunction<T extends Vue = Vue> {
  (to?: (vm: T) => any): void;
}
Vue.config.productionTip = false;

router.beforeEach(authenticateRoute);

export async function authenticateRoute(to: Route, from: Route, next: NextFunction) {
  const isAuthenticated = store.getters.user.authenticated;

  if (!isAuthenticated) {
    // Note, this will check login and reroute to /login if the to route is not public
    await store.dispatch.user.loginOrRedirectOnRouteChange(to);
  }
  next();
}

new Vue({
  router,
  store: store.original,
  vuetify,
  render: h => h(App),
  watch: {
    $route: function (to, from) {
      // Note: removed clearing page data store info here
    },
  },
}).$mount('#app');
