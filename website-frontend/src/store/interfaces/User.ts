// SPDX-License-Identifier: Apache-2.0
import { UserAttributes } from '3xr_types';
import { RoleEnum, QaViewerEnum } from '3xr_types/enums';
import Client from '@/store/interfaces/Client';
import UserRoleType from '@/store/interfaces/types/UserRoleType';
import SequelizeModel, { SequelizeModelInterface } from '@/store/interfaces/common/SequelizeModel';

export interface UserInterface extends UserAttributes, SequelizeModelInterface {
  // children
  clients: Client[];
  primaryRole: UserRoleType;

  // computed
  fullName: string;
  newPassword: string;
  token: string;

  // functions
  setClients(clients: Array<Client>): void;
}

export default class User extends SequelizeModel implements UserInterface {
  // User Attributes
  admin: boolean = false;
  apiToken: string = '';
  artist: boolean = false;
  email: string = '';
  emailNotifications = false;
  firstName: string = '';
  hash: string = ''; // never sent to the client
  lastName: string = '';
  phone: string = '';
  primaryRoleId: number = RoleEnum.ARTIST;
  qaViewer: number = QaViewerEnum.GOOGLE_MODEL_VIEWER;
  token: string = '';
  username: string = '';

  // children
  clients: Client[] = [];
  primaryRole: UserRoleType = new UserRoleType(null);

  // computed
  fullName: string = '';
  newPassword: string = ''; // not loaded from database, only used to change the password

  constructor(data: any) {
    super(data); // id, createdAt, updatedAt
    if (data) {
      this.admin = data.admin;
      this.apiToken = data.apiToken;
      this.artist = data.artist;
      this.email = data.email;
      this.emailNotifications = data.emailNotifications;
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.phone = data.phone;
      this.primaryRoleId = data.primaryRoleId;
      this.qaViewer = data.qaViewer || QaViewerEnum.GOOGLE_MODEL_VIEWER;
      this.token = data.token;
      this.username = data.username;
      this.setClients(data.clients);
      this.primaryRole = new UserRoleType(data.primaryRole);
      if (!data.firstName && !data.lastName) {
        this.fullName = '[NO NAME]';
      } else if (!data.firstName || !data.lastName) {
        this.fullName = data.firstName ? data.firstName : data.lastName;
      } else {
        this.fullName = data.firstName + ' ' + data.lastName;
      }
    }
  }
  setClients(clients: Array<Client>) {
    this.clients = [];
    if (clients) {
      clients.forEach((client: any) => {
        this.clients.push(new Client(client));
      });
    }
  }
}

export interface UserLoginRequest {
  username: string;
  password: string;
  get_token: boolean;
}
