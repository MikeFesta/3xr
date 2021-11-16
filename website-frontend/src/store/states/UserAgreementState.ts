// SPDX-License-Identifier: Apache-2.0
import { ActionContext } from 'vuex';
import { RootState } from '@/store';
import backend from '@/services/3xrCom';
import UserAgreement, {
  UserAgreementInterface,
} from '@/store/interfaces/UserAgreement';
import { AxiosResponse } from 'axios';
import { USER_AGREEMENT_TYPE } from '@/store/interfaces/types/UserAgreementType';

export interface UserAgreementState {
  userAgreement: null | UserAgreementInterface;
}

export default {
  namespaced: true as true,
  state: {
    userAgreement: null,
  } as UserAgreementState,
  mutations: {
    LOAD(state: UserAgreementState, userAgreement: UserAgreementInterface) {
      state.userAgreement = new UserAgreement(userAgreement);
    },
    CLEAR(state: UserAgreementState) {
      state.userAgreement = null;
    },
  },
  getters: {
    isPrivacyAgreementType: () => (userAgreementType: USER_AGREEMENT_TYPE): boolean =>
      userAgreementType === USER_AGREEMENT_TYPE.PRIVACY_POLICY
  },
  actions: {
    async setAgreeementAsTermsOfService({ commit }: ActionContext<UserAgreementState, RootState>): Promise<void> {
      try {
        const TERMS_OF_SERVICE_URL = '/user/user_agreements/terms_of_service/latest';
        const userAgreement: AxiosResponse<UserAgreementInterface> = await backend.get(TERMS_OF_SERVICE_URL);
        commit('LOAD', userAgreement.data);
      } catch (err) {
        commit('CLEAR');
      }
    },
    async setAgreeementAsPrivacyPolicy({ commit }: ActionContext<UserAgreementState, RootState>): Promise<void> {
      try {
        const PRIVACY_POLICY_URL = '/user/user_agreements/privacy_policy/latest';
        const userAgreement: AxiosResponse<UserAgreementInterface> = await backend.get(PRIVACY_POLICY_URL);
        commit('LOAD', userAgreement.data);
      } catch (err) {
        commit('CLEAR');
      }
    },
  },
};
