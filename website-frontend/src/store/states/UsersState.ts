// SPDX-License-Identifier: Apache-2.0
import User, { UserInterface } from '@/store/interfaces/User';
import { ActionContext } from 'vuex';
import backend from '@/services/3xrCom';

export interface UsersState {
  users: UserInterface[];
}

export default {
  namespaced: true as true,
  state: {
    users: [],
  } as UsersState,
  mutations: {
    LOAD(state: UsersState, users: User[]) {
      state.users = [];
      for (let i = 0; i < users.length; i++) {
        state.users.push(new User(users[i]));
      }
    },
    CLEAR(state: UsersState) {
      state.users = [];
    },
  },
  getters: {},
  actions: {
    async loadAllForAdmin({ commit, getters }: ActionContext<UsersState, UsersState>) {
      commit('CLEAR');
      const userSearch = await backend.get('admin/user/search');
      commit('LOAD', userSearch.data);
    },
    async loadForClient({ commit, getters }: ActionContext<UsersState, UsersState>, id: number) {
      commit('CLEAR');
      const { data } = await backend.post('client/users', { id });
      commit('LOAD', data);
    },
  },
};
