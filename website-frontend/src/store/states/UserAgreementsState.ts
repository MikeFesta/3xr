// SPDX-License-Identifier: Apache-2.0
import { ActionContext } from 'vuex';
import { RootState } from '@/store';
import backend from '@/services/3xrCom';
import UserAgreement, {
  UserAgreementInterface,
} from '@/store/interfaces/UserAgreement';
import { USER_AGREEMENT_TYPE } from '@/store/interfaces/types/UserAgreementType';

export interface UserAgreementsState {
  userAgreements: null | UserAgreementInterface[];
}

export default {
  namespaced: true as true,
  state: {
    userAgreements: null,
  } as UserAgreementsState,
  mutations: {
    SET(state: UserAgreementsState, userAgreements: UserAgreementInterface[]) {
      if (Array(userAgreements)) {
        state.userAgreements = userAgreements.map((userAgreement) => new UserAgreement(userAgreement))
      }
    },
    CLEAR(state: UserAgreementsState) {
      state.userAgreements = null;
    },
  },
  getters: {
    userAgreementsToEnterSite: (state: UserAgreementsState, getters: any, rootState: RootState, rootGetters: any): null | UserAgreementInterface[] => {
      if (state.userAgreements) {
        const agreementTypes = [USER_AGREEMENT_TYPE.PRIVACY_POLICY, USER_AGREEMENT_TYPE.TERMS_OF_SERVICE];
        return state.userAgreements.filter((userAgreement) => agreementTypes.includes(userAgreement.userAgreementTypeId));
      }
      return null;
    },
    isUserEligableToEnterSite: (state: UserAgreementsState, getters: any, rootState: RootState, rootGetters: any): boolean => {
      const responses = rootState.usersAgreementResponses.userAgreementResponses;
      if (state.userAgreements && responses) {
        const agreementTypes = [USER_AGREEMENT_TYPE.PRIVACY_POLICY, USER_AGREEMENT_TYPE.TERMS_OF_SERVICE];
        const userAgreements = state.userAgreements.filter((userAgreement) => agreementTypes.includes(userAgreement.userAgreementTypeId));
        const userAgreementIds = userAgreements.map((userAgreement) => userAgreement.id);
        const responsesToCheck = responses.filter((response) => userAgreementIds.includes(response.userAgreementId))
        // Check that all of the responses are present & are answered in the affirmitive
        return ((responses.length === userAgreements.length) && responsesToCheck.every((response) => response.response));
      }
      return false;
    }
  },
  actions: {
    async fetchAll({ commit, dispatch }: ActionContext<UserAgreementsState, RootState>): Promise<void> {
      try {
        await dispatch('usersAgreementResponses/fetchAll', null, { root: true })
        const userAgreements = await backend.get('/user/user_agreements')
        commit('SET', userAgreements.data);
      } catch (err) {
        commit('CLEAR');
      }
    },
  },
};
