// SPDX-License-Identifier: Apache-2.0
import { AxiosResponse } from 'axios';
import { ActionContext } from 'vuex';
import { ProductHoldingAttributes } from '3xr_types';
import backend from '@/services/3xrCom';
import { RootState } from '@/store/index';
import ProductHolding from '@/store/interfaces/ProductHolding';

export interface ProductHoldingState {
  productHoldings: ProductHolding[];
}

export default {
  namespaced: true as true,
  state: {
    productHoldings: [],
  } as ProductHoldingState,
  mutations: {
    CLEAR(state: ProductHoldingState) {
      state.productHoldings = [];
    },
    SET(state: ProductHoldingState, productHoldings: ProductHoldingAttributes[]) {
      state.productHoldings = productHoldings.map(data => new ProductHolding(data));
    },
  },
  getters: {},
  actions: {
    async fetchImports({ commit, state }: ActionContext<ProductHoldingState, RootState>) {
      commit('CLEAR');
      const { data }: AxiosResponse<{ projectHoldings: ProductHoldingAttributes[] }> = await backend.get(
        '/product/client_holdings',
      );
      if (data) {
        commit('SET', data);
      }
    },
  },
};
