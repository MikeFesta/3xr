// SPDX-License-Identifier: Apache-2.0
import Theme from '@/store/interfaces/Theme';

export interface ThemeState {
  theme: Theme;
}

export default {
  namespaced: true as true,
  state: {
    theme: new Theme('default'),
  } as ThemeState,
  mutations: {},
  getters: {},
  actions: {},
};
