// SPDX-License-Identifier: Apache-2.0
import Product, { ProductInterface } from '@/store/interfaces/Product';
import { ActionContext } from 'vuex';
import backend from '@/services/3xrCom';
import { RootState } from '@/store/index';

export interface ProductsState {
  products: ProductInterface[];
}

export default {
  namespaced: true as true,
  state: {
    products: [],
  } as ProductsState,
  mutations: {
    LOAD(state: ProductsState, products: Product[]) {
      state.products = [];
      for (let i = 0; i < products.length; i++) {
        state.products.push(new Product(products[i]));
      }
    },
    CLEAR(state: ProductsState) {
      state.products = [];
    },
  },
  getters: {},
  actions: {
    async loadAllForAdmin({ commit, getters }: ActionContext<ProductsState, RootState>) {
      const search = await backend.post('product/search');
      commit('LOAD', search.data);
    },
  },
};
