// SPDX-License-Identifier: Apache-2.0
import { USER_AGREEMENT_TYPE } from '@/store/interfaces/types/UserAgreementType';

export interface UserAgreementInterface {
  id: number;
  userAgreementTypeId: USER_AGREEMENT_TYPE;
  version: number;
  content: string;
}

export default class UserAgreement implements UserAgreementInterface {
  id: number = 0;
  userAgreementTypeId: number = 0;
  version: number = 0;
  content: string = '';
  constructor(data: UserAgreementInterface) {
    if (data) {
      this.id = data.id;
      this.userAgreementTypeId = data.userAgreementTypeId;
      this.version = data.version;
      this.content = data.content;
    }
  }
}
