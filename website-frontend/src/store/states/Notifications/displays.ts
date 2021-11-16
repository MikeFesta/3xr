// SPDX-License-Identifier: Apache-2.0
import { IUser } from './interfaces';

export const displayUser = (user: IUser): string =>
   user.fullName ? user.fullName : user.username