// SPDX-License-Identifier: Apache-2.0
import User, { UserInterface, UserLoginRequest } from '@/store/interfaces/User';
import { ActionContext } from 'vuex';
import router from '@/router';
import backend from '@/services/3xrCom';
import store, { RootState } from '@/store/index';
import { Route } from 'vue-router';
import { publicRoutes } from '@/router/index';
import { USER_ROLE_NAME } from '@/store/interfaces/types/UserRoleType';
import { UsersState } from './UsersState';
import { AxiosResponse } from 'axios';
import { RoleEnum } from '3xr_types/enums';

export interface UserState {
  user: UserInterface;
}

export default {
  namespaced: true as true,
  state: {
    user: new User(null),
  } as UserState,
  mutations: {
    LOGIN(state: UserState, user: User) {
      if (user.token) {
        localStorage.setItem('user-token', user.token);
      }
      // Keep the API token (if any), since it is loaded separately
      user.apiToken = state.user.apiToken || '';
      state.user = new User(user);
    },
    LOGOUT(state: UserState) {
      localStorage.removeItem('user-token');
      state.user = new User(null);
    },
    SET_API_TOKEN(state: UserState, token: string) {
      state.user.apiToken = token;
    },
    SET_PRIMARY_ROLE(state: UserState, roleId: number) {
      state.user.primaryRoleId = roleId;
    },
  },
  getters: {
    authenticated: (state: UserState) => state.user.id > 0,
    isArtist: (state: UserState) => state.user.primaryRoleId === RoleEnum.ARTIST,
    isClient: (state: UserState) => state.user.primaryRoleId === RoleEnum.CLIENT,
    isAdmin: (state: UserState) => state.user.primaryRoleId === RoleEnum.ADMIN,
    isQa: (state: UserState) => state.user.primaryRoleId === RoleEnum.QA,
    isStudioAdmin: (state: UserState) => state.user.primaryRoleId === RoleEnum.STUDIO_ADMIN,
    role: (state: UserState) => {
      switch (state.user.primaryRoleId) {
        case RoleEnum.ARTIST:
          return USER_ROLE_NAME.ARTIST;
        case RoleEnum.CLIENT:
          return USER_ROLE_NAME.CLIENT;
        case RoleEnum.ADMIN:
          return USER_ROLE_NAME.ADMIN;
        case RoleEnum.QA:
          return USER_ROLE_NAME.QA;
        case RoleEnum.STUDIO_ADMIN:
          return USER_ROLE_NAME.STUDIO_ADMIN;
        default:
          return USER_ROLE_NAME.ARTIST;
      }
    },
    initials: (state: UserState, getters: any): string => {
      return getters.getInitials(state.user);
    },
    getUserDisplayedIdentity: () => (user: UserInterface): string => {
      return user.fullName ? user.fullName : user.username;
    },
    getInitials: () => (user: UserInterface): string => {
      if (user.fullName && user.fullName !== '[NO NAME]') {
        const names = user.fullName.trim().split(' ');
        const initials = names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}` : `${names[0][0]}`;
        return initials.toUpperCase();
      } else {
        return `${user.username.substring(0, 2)}`;
      }
    },
  },
  actions: {
    setPrimaryRole({ commit, getters }: ActionContext<UserState, RootState>, id: number) {
      commit('SET_PRIMARY_ROLE', id);
      //@ts-ignore
      const currentPath = router.history.current.fullPath;
      const allRoles = Object.values(USER_ROLE_NAME);
      const previousRole = allRoles.find(role => currentPath.includes(role));

      if (previousRole) {
        // if route has /:role in it's path, replace with the newly changed role.
        router.push(currentPath.replace(previousRole, getters.role));
      }
    },
    redirectNonPublicToLogin({ state, getters }: ActionContext<UserState, RootState>, to: Route) {
      if ((!state.user || !getters.authenticated) && !publicRoutes.includes(to.name || '')) {
        router.replace({
          name: 'login',
        });
      }
    },
    async authenticationError({ commit, getters }: ActionContext<UserState, RootState>, query?: string) {
      if (!getters.authenticated) {
        // A 403 response was returned, go to login
        // This happens with old tabs left open

        const redirectUrl = query ? `/login?${query}` : '/login';

        router.push(redirectUrl);
        store.dispatch.user.logout(router.currentRoute);
      }
      // TODO: If logged in, show an error message once we have universal error messages
      // In this case, the user is logged in, but does not have permission for what they tried to do
    },
    async fetchByUsername({ dispatch }: ActionContext<UserState, RootState>, username?: string) {
      const result = await backend.get('user/details/' + username);
      if (result.data.username && result.data.username.toLowerCase() === username?.toLowerCase()) {
        await dispatch('setUser', result.data);
      } else {
        throw new Error('Username (' + username + ') Not Found');
      }
    },
    async setUser({ commit, dispatch }: ActionContext<UserState, RootState>, user: UserInterface) {
      commit('LOGIN', user);
      await dispatch('notifications/fetchNotifications', null, { root: true });
    },
    async loginUser({ dispatch }: ActionContext<UserState, RootState>, request: UserLoginRequest) {
      const result = await backend.post('user/login', request);
      if (result.data.username.toLowerCase() === request.username.toLowerCase()) {
        await dispatch('setUser', result.data);
      } else {
        throw new Error(result.data);
      }
    },
    async loginOauth(
      { }: ActionContext<UserState, RootState>,
      request: UserLoginRequest & { redirectUri: string; clientId: string; storeHash: string },
    ): Promise<void> {
      const result: AxiosResponse<{ redirectUri: string; authorizationCode: string }> = await backend.post(
        `auth/authorize?client_id=${request.clientId}&redirect_uri=${request.redirectUri}&store_hash=${request.storeHash}`,
        request,
      );
      const { redirectUri, authorizationCode } = result.data;
      window.location.replace(`${redirectUri}&authorization_code=${authorizationCode}`);
    },
    async checkLoginWithToken({
      dispatch,
    }: ActionContext<UsersState, RootState>): Promise<AxiosResponse<any> | undefined> {
      const token = localStorage.getItem('user-token');
      if (token) {
        return backend.post('user/login_with_token', token);
      }
    },
    async loginOrRedirectOnRouteChange({ commit }: ActionContext<UserState, RootState>, to: Route) {
      if (to.name === 'login') {
        return;
      }

      const loggedIn = await backend.get('user/check_login');
      if (loggedIn.data === true) {
        try {
          const response = await backend.get('user/my_info');
          commit('LOGIN', response.data);

          // Get Notifications when logging in
          store.dispatch.notifications.fetchNotifications();
        } catch (err) {
          // redirect
          store.dispatch.user.redirectNonPublicToLogin(to);
        }
      } else {
        const token = localStorage.getItem('user-token');
        if (token) {
          try {
            const result = await backend.post('user/login_with_token', {
              token,
            });
            const user = result.data;
            if (user.id > 0) {
              // Valid User
              commit('LOGIN', user);
            } else {
              store.dispatch.user.redirectNonPublicToLogin(to);
            }
          } catch {
            store.dispatch.user.redirectNonPublicToLogin(to);
          }
        } else {
          store.dispatch.user.redirectNonPublicToLogin(to);
        }
      }
    },
    logout({ commit }: ActionContext<UserState, RootState>, to: Route) {
      backend.get('/user/logout').then(result => {
        if (result.data === 'success') {
          commit('LOGOUT');
          store.dispatch.user.redirectNonPublicToLogin(to);
        }
      });
    },
  },
};
