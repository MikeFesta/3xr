// SPDX-License-Identifier: Apache-2.0
import IdName, { IdNameInterface } from '@/store/interfaces/common/IdName';

export interface UserRoleTypeInterface extends IdNameInterface {
  id: USER_ROLE_TYPE;
}

// TODO: this currently lives in the roles table in 3xr_backend and should use 3xr_types/enums as a source of truth
export enum USER_ROLE_TYPE {
  UNKNOWN = 0,
  ARTIST, // 1
  CLIENT, // 2
  ADMIN, // 3
  QA, // 4
  STUDIO_ADMIN, // 5
}

// some of the matches check the name instead of the number
// TODO: should refactor to only check number instead of name. This name is used in the URL for common pages (dashboard, purchase orders, jobs, etc...)
// The function name probably does not need to be in the URL ... try to remove it
export enum USER_ROLE_NAME {
  ADMIN = 'admin',
  ARTIST = 'artist',
  CLIENT = 'client',
  QA = 'qa',
  STUDIO_ADMIN = 'studio',
}

export default class UserRoleType extends IdName implements UserRoleTypeInterface {
  id: USER_ROLE_TYPE = USER_ROLE_TYPE.UNKNOWN;
  name: string = '';

  constructor(data: any) {
    super(data);
    if (data) {
      this.id = data.id;
      this.name = data.name;
    }
  }

  static getPickList() {
    return [
      new UserRoleType({ id: USER_ROLE_TYPE.ADMIN, name: '3XR Admin' }),
      new UserRoleType({ id: USER_ROLE_TYPE.ARTIST, name: 'Artist' }),
      new UserRoleType({ id: USER_ROLE_TYPE.CLIENT, name: 'Client' }),
      new UserRoleType({ id: USER_ROLE_TYPE.QA, name: 'QA' }),
      new UserRoleType({ id: USER_ROLE_TYPE.STUDIO_ADMIN, name: 'Studio' }),
    ];
  }
}
