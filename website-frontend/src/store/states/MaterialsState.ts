// SPDX-License-Identifier: Apache-2.0
import Material, { MaterialInterface } from '@/store/interfaces/Material';
import { ActionContext } from 'vuex';
import backend from '@/services/3xrCom';
import { RootState } from '@/store/index';

export interface MaterialsState {
  materials: MaterialInterface[];
}

export default {
  namespaced: true as true,
  state: {
    materials: [],
  } as MaterialsState,
  mutations: {
    LOAD(state: MaterialsState, materials: Material[]) {
      state.materials = [];
      for (let i = 0; i < materials.length; i++) {
        state.materials.push(new Material(materials[i]));
      }
    },
    CLEAR(state: MaterialsState) {
      state.materials = [];
    },
  },
  getters: {},
  actions: {
    async loadAllForAdmin({ commit, getters }: ActionContext<MaterialsState, RootState>) {
      const materialSearch = await backend.get('material/search');
      commit('LOAD', materialSearch.data);
    },
  },
};
