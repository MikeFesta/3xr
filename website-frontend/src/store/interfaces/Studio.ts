// SPDX-License-Identifier: Apache-2.0
import { StudioAttributes } from '3xr_types';
import SequelizePicklist, { SequelizePicklistInterface } from '@/store/interfaces/common/SequelizePicklist';
import User, { UserInterface } from '@/store/interfaces/User';

export interface StudioInterface extends SequelizePicklistInterface, StudioAttributes {
  // children
  users: Array<UserInterface>;

  // functions
  setUsers(classes: Array<UserInterface>): void;
}

export default class Studio extends SequelizePicklist implements StudioInterface {
  // ClientAttributes
  uid: string = '';

  // children
  users: Array<UserInterface> = [];

  constructor(data: any) {
    super(data); // id, name, createdAt, updatedAt
    if (data) {
      this.uid = data.uid;

      this.setUsers(data.users);
    }
  }

  setUsers(users: Array<UserInterface>) {
    this.users = [];
    if (users) {
      users.forEach((user: any) => {
        this.users.push(new User(user));
      });
    }
  }
}
