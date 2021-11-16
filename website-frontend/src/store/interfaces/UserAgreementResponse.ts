// SPDX-License-Identifier: Apache-2.0
export interface UserAgreementResponseInterface {
  id: number;
  userAgreementId: number;
  response: boolean;
  userId: number;
}

export interface UserResponseCommandInterface {
  userAgreementId: number;
  response: boolean;
}

export default class UserAgreementResponse implements UserAgreementResponseInterface {
  id: number = 0
  userAgreementId: number = 0;
  response: boolean = false;
  userId: number = 0;
  constructor(data: any) {
    if (data) {
      this.id = data.id;
      this.userAgreementId = data.userAgreementId;
      this.response = data.response;
      this.userId = data.userId;
    }
  }
}
