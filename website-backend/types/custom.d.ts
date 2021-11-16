// SPDX-License-Identifier: Apache-2.0
interface IUser {
  id: number;
  admin: boolean;
  artist: boolean;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  primaryRoleId: number;
  username: string;
}

declare namespace Express {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface User extends IUser {}
  export interface Request {
    file?: any;
    user?: User;
  }
}

declare module 'passport-auth-token';
