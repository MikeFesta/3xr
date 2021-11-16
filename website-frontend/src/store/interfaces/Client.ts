// SPDX-License-Identifier: Apache-2.0
import { ClientAttributes } from '3xr_types';
import ClientBrand, { ClientBrandInterface } from '@/store/interfaces/ClientBrand';
import ClientClass, { ClientClassInterface } from '@/store/interfaces/ClientClass';
import SequelizePicklist, { SequelizePicklistInterface } from '@/store/interfaces/common/SequelizePicklist';
import User, { UserInterface } from '@/store/interfaces/User';

export interface ClientInterface extends SequelizePicklistInterface, ClientAttributes {
  // children
  brands: Array<ClientBrandInterface>;
  classes: Array<ClientClassInterface>;
  users: Array<UserInterface>;

  // functions
  setBrands(brands: Array<ClientBrandInterface>): void;
  setClasses(classes: Array<ClientClassInterface>): void;
  setUsers(classes: Array<UserInterface>): void;
}

export default class Client extends SequelizePicklist implements ClientInterface {
  // ClientAttributes
  uid: string = '';

  // children
  brands: Array<ClientBrandInterface> = [];
  classes: Array<ClientClassInterface> = [];
  users: Array<UserInterface> = [];

  constructor(data: any) {
    super(data); // id, name, createdAt, updatedAt
    if (data) {
      this.uid = data.uid;

      this.setBrands(data.brands);
      this.setClasses(data.classes);
      this.setUsers(data.users);
    }
  }
  setBrands(brands: Array<ClientBrandInterface>) {
    this.brands = [];
    if (brands) {
      brands.forEach((brand: any) => {
        this.brands.push(new ClientBrand(brand));
      });
    }
  }
  setClasses(classes: Array<ClientClassInterface>) {
    this.classes = [];
    if (classes) {
      classes.forEach((clss: any) => {
        this.classes.push(new ClientClass(clss));
      });
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
