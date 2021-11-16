// SPDX-License-Identifier: Apache-2.0
import { ActionContext } from 'vuex';
import backend from '@/services/3xrCom';
import User, { UserInterface } from '@/store/interfaces/User';
import { RootState } from '@/store/index';

export interface ArtistsState {
  artists: Array<User>;
}

export default {
  namespaced: true as true,
  state: {
    artists: [],
  } as ArtistsState,
  mutations: {
    CLEAR(state: ArtistsState) {
      state.artists = [];
    },
    SET(state: ArtistsState, artists: Array<User>) {
      let artistObject = [];
      if (artists) {
        for (let i = 0; i < artists.length; i++) {
          artistObject.push(new User(artists[i]));
        }
      }
      state.artists = artistObject;
    },
  },
  getters: {
    artistFilter: () => (item: UserInterface, queryText: string): boolean => {
      return (
        item.email.toLocaleLowerCase().includes(queryText.toLocaleLowerCase()) ||
        item.lastName.toLocaleLowerCase().includes(queryText.toLocaleLowerCase()) ||
        item.firstName.toLocaleLowerCase().includes(queryText.toLocaleLowerCase())
      );
    }
  },
  actions: {
    async loadAllForAdmin({ commit, state }: ActionContext<ArtistsState, RootState>) {
      if (state.artists.length === 0) {
        const artistsResult = await backend.get('/user/artist_picklist');
        commit('SET', artistsResult.data);
      }
    },
    async loadForStudio({ commit, state }: ActionContext<ArtistsState, RootState>, id: number) {
      commit('CLEAR');
      const artistsResult = await backend.post('/studio/artist_picklist', { id: id });
      commit('SET', artistsResult.data);
    },
  },
};
