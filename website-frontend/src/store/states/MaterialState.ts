// SPDX-License-Identifier: Apache-2.0
import Material, { MaterialInterface } from '@/store/interfaces/Material';
import { ActionContext } from 'vuex';
import backend from '@/services/3xrCom';
import { RootState } from '@/store/index';

export interface MaterialState {
  material: MaterialInterface;
}

export default {
  namespaced: true as true,
  state: {
    material: new Material(null),
  } as MaterialState,
  mutations: {
    LOAD(state: MaterialState, material: Material) {
      state.material = new Material(material);
    },
    CLEAR(state: MaterialState) {
      state.material = new Material(null);
    },
  },
  getters: {},
  actions: {
    async loadByUid({ commit, getters }: ActionContext<MaterialState, RootState>, uid: string) {
      const mat = await backend.get('material/details/' + uid);
      commit('LOAD', mat.data);
    },
  },
};
