// SPDX-License-Identifier: Apache-2.0
import { ActionContext } from 'vuex';
import { RootState } from '@/store';
import backend from '@/services/3xrCom';
import UserAgreementResponse, {
  UserAgreementResponseInterface, UserResponseCommandInterface
} from '@/store/interfaces/UserAgreementResponse';
import { USER_AGREEMENT_TYPE } from '@/store/interfaces/types/UserAgreementType';
import { AxiosResponse } from 'axios';

export interface UserAgreementResponsesState {
  userAgreementResponses: null | UserAgreementResponseInterface[];
}

export default {
  namespaced: true as true,
  state: {
    userAgreementResponses: null,
  } as UserAgreementResponsesState,
  mutations: {
    LOAD(state: UserAgreementResponsesState, userAgreementResponses: UserAgreementResponse[]) {
      state.userAgreementResponses = userAgreementResponses;
    },
    CLEAR(state: UserAgreementResponsesState) {
      state.userAgreementResponses = null;
    },
  },
  getters: {
    isConfirmToAgreements: (state: UserAgreementResponsesState) => (userAgreementTypes: USER_AGREEMENT_TYPE): boolean => {
      if (state.userAgreementResponses) {
        return state.userAgreementResponses.every((userAgreementResponse) => userAgreementResponse.response)
      }
      return false;
    }
  },
  actions: {
    async fetchAll(
      { commit, rootGetters }: ActionContext<UserAgreementResponsesState, RootState>): Promise<void> {
      if (rootGetters['user/authenticated']) {
        try {
          const userAgreements: AxiosResponse<UserAgreementResponseInterface[]> = await backend.get(`user/user_agreements/responses`);
          commit('LOAD', userAgreements.data);
        } catch (err) {
          commit('CLEAR');
        }
      }
    },
    async submitResponses(
      { commit, dispatch, rootGetters }: ActionContext<UserAgreementResponsesState, RootState>,
      userResponseCommands: UserResponseCommandInterface[],
    ) {
      if (rootGetters['user/authenticated']) {
        commit('CLEAR');
        await Promise.all(userResponseCommands.map((userResponseCommand) => {
          return backend.post('user/user_agreements/submit_response', userResponseCommand);
        }))
        await dispatch('fetchAll');
      }
    },
  },
};
